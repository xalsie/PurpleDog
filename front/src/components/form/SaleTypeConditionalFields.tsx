import { UseFormReturn } from "react-hook-form";
import { InputForm } from "@/components/ui";
import type { ItemFormValues } from "@/lib/validations";

interface SaleTypeConditionalFieldsProps {
  form: UseFormReturn<ItemFormValues>;
  saleType: "AUCTION" | "QUICK_SALE";
  enrichmentLoading?: boolean;
}

export function SaleTypeConditionalFields({
  form,
  saleType,
  enrichmentLoading = false,
}: SaleTypeConditionalFieldsProps) {
  const { register, formState: { errors } } = form;

  if (saleType === "QUICK_SALE") {
    return (
      <div className="space-y-4 border-l-4 border-green-500 pl-4 py-2">
        <h3 className="font-semibold text-green-700">Vente Rapide</h3>
        <div className={enrichmentLoading ? "opacity-50 pointer-events-none" : ""}>
          <InputForm
            label="Prix de vente fixe (€)"
            id="desired_price"
            type="number"
            step="0.01"
            placeholder="Entrez le prix fixe"
            disabled={enrichmentLoading}
            {...register("desired_price", { 
              valueAsNumber: true
            })}
            error={errors.desired_price}
          />
        </div>
        {enrichmentLoading && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            Recherche Catawiki en cours...
          </div>
        )}
        <p className="text-xs text-gray-500">
          ℹ️ L'acheteur achète immédiatement à ce prix
        </p>
      </div>
    );
  }

  if (saleType === "AUCTION") {
    return (
      <div className="space-y-4 border-l-4 border-blue-500 pl-4 py-2">
        <h3 className="font-semibold text-blue-700">Enchère</h3>
        
        <div className={enrichmentLoading ? "opacity-50 pointer-events-none" : ""}>
          <InputForm
            label="Prix de départ (€)"
            id="starting_price"
            type="number"
            step="0.01"
            placeholder="Entrez le prix de départ"
            disabled={enrichmentLoading}
            {...register("starting_price", { 
              valueAsNumber: true
            })}
            error={errors.starting_price}
          />

          <InputForm
            label="Prix minimum accepté (€)"
            id="min_price_accepted"
            type="number"
            step="0.01"
            placeholder="Entrez le prix minimum (optionnel)"
            disabled={enrichmentLoading}
            {...register("min_price_accepted", { 
              valueAsNumber: true
            })}
            error={errors.min_price_accepted}
          />
        </div>

        {enrichmentLoading && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            Recherche Catawiki en cours...
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded">
          <p className="text-xs text-gray-600">
            ⏰ <strong>Durée:</strong> 7 jours<br/>
            💡 Les acheteurs peuvent enchérir à partir du prix de départ
          </p>
        </div>
      </div>
    );
  }

  return null;
}
