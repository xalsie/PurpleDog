import type { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { FormInput, FormTextarea } from "./Fields";
import { SaleTypeConditionalFields } from "./SaleTypeConditionalFields";
import type { ItemFormValues } from "@/lib/validations";
import type { UseFormReturn } from "react-hook-form";

interface ItemFieldsProps {
  register: UseFormRegister<ItemFormValues>;
  errors: FieldErrors<ItemFormValues>;
  form: UseFormReturn<ItemFormValues>;
  enrichmentLoading?: boolean;
}

export function ItemFields({ register, errors, form, enrichmentLoading = false }: ItemFieldsProps) {
  const saleType = useWatch({ control: form.control, name: "sale_type" });
  const categories = useWatch({ control: form.control, name: "category" });
  
  const categoryOptions = [
    "Peinture",
    "Sculpture", 
    "Bijoux",
    "Montre",
    "Mobilier",
    "Céramique",
    "Art Déco",
    "Livres Rares",
    "Autres"
  ];

  const toggleCategory = (cat: string) => {
    const current = categories || [];
    if (current.includes(cat)) {
      form.setValue("category", current.filter(c => c !== cat), { shouldValidate: true });
    } else {
      form.setValue("category", [...current, cat], { shouldValidate: true });
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          label="Titre de l'objet"
          placeholder="ex: Vase en porcelaine signé"
          {...register("name")}
          error={errors.name?.message as string | undefined}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#0b071a]">Type de vente</label>
          <div className="flex gap-4">
            {["AUCTION", "QUICK_SALE"].map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  value={type}
                  {...register("sale_type")}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-600"
                />
                {type === "AUCTION" ? "Enchère" : "Vente rapide"}
              </label>
            ))}
          </div>
          {errors.sale_type && <p className="text-sm text-red-500">{errors.sale_type.message as string}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#0b071a]">Catégories *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categoryOptions.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={(categories || []).includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="h-4 w-4 text-purple-600 rounded focus:ring-purple-600"
              />
              {cat}
            </label>
          ))}
        </div>
        {errors.category && <p className="text-sm text-red-500">{errors.category.message as string}</p>}
      </div>

      <FormTextarea
        label="Description"
        rows={5}
        placeholder="Décrivez l'objet, son état, son histoire..."
        {...register("description")}
        error={errors.description?.message as string | undefined}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <FormInput
          label="Hauteur (cm)"
          type="number"
          step="0.01"
          min="0"
          {...register("dimensions.height", { valueAsNumber: true })}
          error={errors.dimensions?.height?.message as string | undefined}
        />
        <FormInput
          label="Largeur (cm)"
          type="number"
          step="0.01"
          min="0"
          {...register("dimensions.width", { valueAsNumber: true })}
          error={errors.dimensions?.width?.message as string | undefined}
        />
        <FormInput
          label="Profondeur (cm)"
          type="number"
          step="0.01"
          min="0"
          {...register("dimensions.depth", { valueAsNumber: true })}
          error={errors.dimensions?.depth?.message as string | undefined}
        />
        <FormInput
          label="Poids (kg)"
          type="number"
          step="0.01"
          min="0"
          {...register("weight_kg", { valueAsNumber: true })}
          error={errors.weight_kg?.message as string | undefined}
          helperText="Optionnel"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FormInput
          label="Prix IA (€)"
          type="number"
          step="0.01"
          min="0"
          {...register("ai_estimated_price", { valueAsNumber: true })}
          error={errors.ai_estimated_price?.message as string | undefined}
          helperText="Pré-rempli par l'IA si disponible"
        />
      </div>

      {saleType && <SaleTypeConditionalFields form={form} saleType={saleType as "AUCTION" | "QUICK_SALE"} enrichmentLoading={enrichmentLoading} />}
    </>
  );
}
