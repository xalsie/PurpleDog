import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, type UseFormReturn, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { axiosInstance } from "@/lib/axios";
import { RootState } from "@/store";
import { defaultItemFormValues, itemFormSchema, type ItemFormValues } from "@/lib/validations";
import type { AnalysisResponse, UploadedMedia } from "@/types";

export type UseItemFormReturn = {
  form: UseFormReturn<ItemFormValues>;
  uploadedMedias: UploadedMedia[];
  uploading: boolean;
  analysisLoading: boolean;
  enrichmentLoading: boolean;
  analysisMessage: string | null;
  serverError: string | null;
  successMessage: string | null;
  formKey: number;
  handleFilesChange: (files: FileList | null) => Promise<void> | void;
  setPrimaryMedia: (id: string) => void;
  triggerAnalysis: () => Promise<void>;
  onSubmit: (values: ItemFormValues) => Promise<void>;
  resetForm: () => void;
  buildMediaUrl: (url: string) => string;
};

export function useItemForm(): UseItemFormReturn {
  const { user } = useSelector((state: RootState) => state.user);

  const [uploadedMedias, setUploadedMedias] = useState<UploadedMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [enrichmentLoading, setEnrichmentLoading] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const apiRoot = useMemo(() => {
    const base = axiosInstance.defaults.baseURL || "";
    // Remove /api from the end to get the root URL
    const root = base.endsWith("/api") ? base.slice(0, -4) : base;
    // If still empty, use localhost
    return root || "http://localhost:3001";
  }, []);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema) as Resolver<ItemFormValues>,
    defaultValues: {
      ...defaultItemFormValues,
    },
  });

  const { watch, setValue, setError, clearErrors, reset } = form;

  const buildMediaUrl = useCallback(
    (url: string) => {
      if (url.startsWith("http")) return url;
      // url is already like /uploads/filename.jpg
      const fullUrl = `${apiRoot}${url}`;
      return fullUrl;
    },
    [apiRoot]
  );

  const handleFilesChange = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setUploading(true);
      setAnalysisMessage(null);
      setServerError(null);

      try {
        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append("files", file));
        formData.append("mediaType", "IMAGE");

        const { data } = await axiosInstance.post<UploadedMedia[]>(
          "/medias/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const normalized = data.map((media, index) => ({
          ...media,
          isPrimary: index === 0,
          mediaType: media.mediaType || "IMAGE",
        }));

        setUploadedMedias(normalized);
        setValue(
          "mediaIds",
          normalized.map((m) => m.id),
          { shouldValidate: true }
        );
        clearErrors("mediaIds");
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Échec de l'upload des photos";
        setServerError(message);
      } finally {
        setUploading(false);
      }
    },
    [clearErrors, setValue]
  );

  const setPrimaryMedia = useCallback((id: string) => {
    setUploadedMedias((prev) => prev.map((m) => ({ ...m, isPrimary: m.id === id })));
  }, []);

  const parseWeightFromText = useCallback((text?: string) => {
    if (!text) return undefined;
    const normalized = text.replace(",", ".");
    const match = normalized.match(/([0-9]+(?:\.[0-9]+)?)/);
    if (!match) return undefined;
    const value = Number(match[1]);
    return Number.isFinite(value) ? value : undefined;
  }, []);

  const triggerAnalysis = useCallback(async () => {
    const mediaIds = watch("mediaIds");
    const analysisCategory = watch("analysisCategory");

    if (!mediaIds || mediaIds.length === 0) {
      setError("mediaIds", { type: "manual", message: "Ajoutez des photos avant l'analyse" });
      return;
    }

    const category = analysisCategory && analysisCategory.trim().length > 0
      ? analysisCategory.trim()
      : "general";

    setAnalysisLoading(true);
    setAnalysisMessage(null);
    setServerError(null);

    try {
      const payload = { category, medias: mediaIds };
      
      const { data } = await axiosInstance.post<AnalysisResponse>("/image-analysis", payload);


      const title = data.titre || data.artwork_title || data.title || "";
      if (title) {
        setValue("name", title.toString(), { shouldValidate: true });
      }

      // Description: priorité aux nouveaux champs
      const description = data.description_longue || 
                         data.description_court || 
                         [data.short_description, data.long_description].filter(Boolean).join("\n\n") || 
                         "";
      if (description) {
        setValue("description", description, { shouldValidate: true });
      }

      // Prix: utiliser la moyenne de min/max si disponible, sinon estimated_price
      let estimatedPrice: number | null = null;
      if (data.estimated_price_min && data.estimated_price_max) {
        estimatedPrice = (data.estimated_price_min + data.estimated_price_max) / 2;
      } else if (data.estimated_price_min) {
        estimatedPrice = data.estimated_price_min;
      } else if (data.estimated_price) {
        estimatedPrice = Number(data.estimated_price);
      }
      
      if (estimatedPrice && !Number.isNaN(estimatedPrice) && estimatedPrice > 0) {
        setValue("desired_price", estimatedPrice, { shouldValidate: true });
        setValue("ai_estimated_price", estimatedPrice, { shouldValidate: true });
        
        // Min price accepted à 80% du prix estimé
        if (data.estimated_price_min) {
          setValue("min_price_accepted", data.estimated_price_min, { shouldValidate: true });
        }
      }

      // Poids
      const weightText = data.weight || data.Weight;
      const weight = parseWeightFromText(weightText);
      if (typeof weight !== "undefined") {
        setValue("weight_kg", weight, { shouldValidate: true });
      }

      if (data.height) {
        const h = Number(data.height);
        if (!Number.isNaN(h)) setValue("dimensions.height", h, { shouldValidate: true });
      }
      if (data.width) {
        const w = Number(data.width);
        if (!Number.isNaN(w)) setValue("dimensions.width", w, { shouldValidate: true });
      }
      if (data.depth) {
        const d = Number(data.depth);
        if (!Number.isNaN(d)) setValue("dimensions.depth", d, { shouldValidate: true });
      }

      const analysisMethod = data.method === 'market' ? 'données de marché' : 'analyse visuelle';
      setAnalysisMessage(
        `✅ Analyse terminée (${analysisMethod})${data.artiste ? ` - Artiste: ${data.artiste}` : ''}${data.style ? ` - Style: ${data.style}` : ''}. Les champs ont été pré-remplis.`
      );

      const uniqueAnalysisId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setAnalysisId(uniqueAnalysisId);
      setEnrichmentLoading(true);

      axiosInstance
        .post(
          `/image-analysis/enrich/${uniqueAnalysisId}`,
          {
            artiste: data.artiste,
            style: data.style,
            titre: data.titre,
          }
        )
        .then((response) => {
          
          if (response.data?.data) {
            if (response.data.data.estimated_price) {
              setValue("desired_price", response.data.data.estimated_price, { shouldValidate: true });
              setValue("ai_estimated_price", response.data.data.estimated_price, { shouldValidate: true });
            }

            if (response.data.data.price_range?.min) {
              setValue("starting_price", response.data.data.price_range.min, { shouldValidate: true });
            }
          }
        })
        .catch((err) => {
          console.warn('⚠️ Enrichissement Catawiki non disponible:', err.message);
        })
        .finally(() => {
          setEnrichmentLoading(false);
        });
    } catch (error: any) {
      console.error('❌ Erreur analyse:', error);
      console.error('❌ Erreur status:', error?.response?.status);
      console.error('❌ Erreur data:', JSON.stringify(error?.response?.data, null, 2));
      
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "L'analyse d'image a échoué";
      setServerError(message);
    } finally {
      setAnalysisLoading(false);
    }
  }, [parseWeightFromText, setError, setValue, watch]);

  const onSubmit = useCallback(
    async (values: ItemFormValues) => {
      setServerError(null);
      setSuccessMessage(null);
      setAnalysisMessage(null);

      if (!uploadedMedias.length) {
        setError("mediaIds", { type: "manual", message: "Ajoutez au moins une photo" });
        return;
      }

      const payload = {
        name: values.name,
        category: values.category || [],
        description: values.description,
        dimensions: values.dimensions || { height: 0, width: 0, depth: 0 },
        weight_kg: values.weight_kg,
        desired_price: values.desired_price,
        starting_price: values.starting_price,
        ai_estimated_price: values.ai_estimated_price,
        min_price_accepted: values.min_price_accepted,
        sale_type: values.sale_type,
        medias: uploadedMedias.map((media) => media.id),
      };

      try {
        await axiosInstance.post("/items", payload);
        setSuccessMessage("Objet créé avec succès");
        setUploadedMedias([]);
        form.reset({
          name: "",
          description: "",
          sale_type: "AUCTION",
          category: [],
          dimensions: { height: undefined, width: undefined, depth: undefined },
          weight_kg: undefined,
          desired_price: undefined,
          starting_price: undefined,
          ai_estimated_price: undefined,
          min_price_accepted: undefined,
          mediaIds: [],
          analysisCategory: "",
        });
        setFormKey(prev => prev + 1);
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Échec de la création de l'objet";
        setServerError(message);
      }
    },
    [reset, setError, uploadedMedias]
  );

  const resetForm = useCallback(() => {    
    form.reset({
      name: "",
      description: "",
      sale_type: "AUCTION",
      category: [],
      dimensions: { height: undefined, width: undefined, depth: undefined },
      weight_kg: undefined,
      desired_price: undefined,
      starting_price: undefined,
      ai_estimated_price: undefined,
      min_price_accepted: undefined,
      mediaIds: [],
      analysisCategory: "",
    });
    
    setUploadedMedias([]);
    setAnalysisMessage(null);
    setServerError(null);
    setSuccessMessage(null);
    setEnrichmentLoading(false);
    setAnalysisId(null);
    
    setFormKey(prev => prev + 1);
  }, [form]);

  return {
    form,
    uploadedMedias,
    uploading,
    analysisLoading,
    enrichmentLoading,
    analysisMessage,
    serverError,
    successMessage,
    formKey,
    handleFilesChange,
    setPrimaryMedia,
    triggerAnalysis,
    onSubmit,
    resetForm,
    buildMediaUrl,
  };
}
