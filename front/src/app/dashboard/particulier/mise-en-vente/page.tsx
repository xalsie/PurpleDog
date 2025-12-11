"use client";

import type { SubmitHandler } from "react-hook-form";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { MediaUpload } from "@/components/form/MediaUpload";
import { AnalysisPanel } from "@/components/form/AnalysisPanel";
import { ItemFields } from "@/components/form/ItemFields";
import { useItemForm } from "@/hooks/useItemForm";
import type { ItemFormValues } from "@/lib/validations";

export default function ItemCreatePage() {
  const {
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
  } = useItemForm();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const handleValidSubmit: SubmitHandler<ItemFormValues> = (values) => onSubmit(values);
  const submitForm = handleSubmit(handleValidSubmit as SubmitHandler<ItemFormValues>);

  const isBusy = isSubmitting || uploading || analysisLoading;
  const loadingText = uploading
    ? "Envoi des photos..."
    : analysisLoading
      ? "Analyse IA en cours..."
      : "Création de l'objet...";

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0b1f] via-[#1a1236] to-[#0f0b1f] py-10 px-4">
      <LoadingOverlay show={isBusy} message={loadingText} />

      <Container className="bg-white/95 shadow-2xl backdrop-blur rounded-3xl border border-purple-100 p-8 md:p-12">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-500">Nouvelle annonce</p>
            <h1 className="text-3xl font-bold text-[#0b071a]">Créer un objet</h1>
            <p className="text-sm text-gray-600">
              Ajoutez vos photos en premier, puis laissez l'IA pré-remplir les informations clés. Vous pouvez modifier chaque champ avant de publier.
            </p>
          </header>

          {serverError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          {analysisMessage && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {analysisMessage}
            </div>
          )}

          <MediaUpload
            uploadedMedias={uploadedMedias}
            uploading={uploading}
            isSubmitting={isSubmitting}
            mediaError={errors.mediaIds as any}
            onFilesChange={handleFilesChange}
            onPrimarySelect={setPrimaryMedia}
            buildMediaUrl={buildMediaUrl}
          />

          <AnalysisPanel
            analysisLoading={analysisLoading}
            isSubmitting={isSubmitting}
            uploading={uploading}
            onAnalyze={triggerAnalysis}
            analysisCategoryField={register("analysisCategory")}
            error={errors.analysisCategory?.message as string | undefined}
          />

          <form className="grid gap-6" onSubmit={submitForm} key={formKey}>
            <ItemFields register={register} errors={errors} form={form} enrichmentLoading={enrichmentLoading} />

            <div className="flex flex-col gap-3">
              {errors.mediaIds && <p className="text-sm text-red-500">{errors.mediaIds.message as string}</p>}
              <div className="flex gap-3 flex-wrap items-center justify-end">
                <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                  Réinitialiser
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting || uploading}>
                  {isSubmitting ? "Création..." : "Créer l'objet"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
