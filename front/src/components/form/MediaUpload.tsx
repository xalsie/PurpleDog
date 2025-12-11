import FileField from "@/components/ui/FileField/FileField";
import Button from "@/components/ui/Button";
import type { FieldError } from "react-hook-form";
import type { UploadedMedia } from "@/types";

interface MediaUploadProps {
  uploadedMedias: UploadedMedia[];
  uploading: boolean;
  isSubmitting: boolean;
  mediaError?: FieldError;
  onFilesChange: (files: FileList | null) => void;
  onPrimarySelect: (id: string) => void;
  buildMediaUrl: (url: string) => string;
}

export function MediaUpload({
  uploadedMedias,
  uploading,
  isSubmitting,
  mediaError,
  onFilesChange,
  onPrimarySelect,
  buildMediaUrl,
}: MediaUploadProps) {
  return (
    <section className="rounded-2xl border border-purple-100 bg-purple-50/60 p-6 shadow-inner">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0b071a]">Photos</h2>
          <p className="text-sm text-gray-600">Importez vos images (elles sont envoyées sur /medias/upload immédiatement).</p>
        </div>
        <div className="text-xs text-gray-500">Formats jpg / png - max 10Mo par photo</div>
      </div>

      <div className="mt-4">
        <FileField
          label="Importer des photos"
          multiple
          accept="image/*"
          onChange={(e) => onFilesChange(e.target.files)}
          disabled={uploading || isSubmitting}
          helperText={uploading ? "Envoi en cours..." : "Ajoutez plusieurs images pour de meilleurs résultats."}
          error={mediaError as any}
        />
      </div>

      {uploadedMedias.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {uploadedMedias.map((media) => (
            <div
              key={media.id}
              className={`relative overflow-hidden rounded-xl border ${
                media.isPrimary ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200"
              } bg-white shadow-sm`}
            >
              <img src={buildMediaUrl(media.url)} alt="Aperçu" className="h-40 w-full object-cover" />
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs text-gray-600">{media.mediaType}</span>
                <Button
                  type="button"
                  size="sm"
                  variant={media.isPrimary ? "secondary" : "outline"}
                  onClick={() => onPrimarySelect(media.id)}
                >
                  {media.isPrimary ? "Photo principale" : "Définir principale"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
