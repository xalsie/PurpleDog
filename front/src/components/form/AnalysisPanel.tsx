import Button from "@/components/ui/Button";
import type { UseFormRegisterReturn } from "react-hook-form";

interface AnalysisPanelProps {
  analysisLoading: boolean;
  isSubmitting: boolean;
  uploading: boolean;
  onAnalyze: () => void;
  analysisCategoryField: UseFormRegisterReturn;
  error?: string;
}

export function AnalysisPanel({
  analysisLoading,
  isSubmitting,
  uploading,
  onAnalyze,
  analysisCategoryField,
  error,
}: AnalysisPanelProps) {
  return (
    <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-[#0b071a]">Analyse IA (optionnel)</h2>
          <p className="text-sm text-gray-600">L'IA lit vos images et propose un titre, une description et une estimation.</p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={analysisLoading || isSubmitting || uploading}
          onClick={onAnalyze}
        >
          {analysisLoading ? "Analyse en cours..." : "Analyser les images"}
        </Button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#0b071a]">Catégorie pour l'IA</label>
          <input
            {...analysisCategoryField}
            placeholder="ex: Peinture, Sculpture, Montre..."
            className={`w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 ${
              error ? "border-red-500 ring-red-200" : "border-gray-200"
            }`}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!error && (
            <p className="text-xs text-gray-500">
              Utilisé uniquement pour guider l'analyse, pas pour la création d'objet.
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-gray-500">
            L'analyse appelle /image-analysis avec vos mediaIds. Les champs sont pré-remplis mais restent modifiables.
          </p>
        </div>
      </div>
    </div>
  );
}
