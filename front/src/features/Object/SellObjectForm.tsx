import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "@/components/ui/InputForm/InputForm";
import { Button } from "@/components/ui";


const objectSchema = z.object({
  name: z.string().min(1, "Nom obligatoire"),
  category: z.string().min(1, "Veuillez choisir une catégorie"),
  height: z.string().min(1, "Hauteur obligatoire"),
  width: z.string().min(1, "Largeur obligatoire"),
  depth: z.string().min(1, "Profondeur obligatoire"),
  weight: z.string().min(1, "Poids obligatoire"),
  description: z.string().min(10, "Minimum 10 caractères"),
  documents: z.any().optional(),
  photos: z
    .any()
    .refine(
      (files) => files?.length >= 10,
      "Vous devez importer au minimum 10 photos"
    ),
  price: z.string().min(1, "Prix obligatoire"),
  saleMode: z.string().min(1, "Mode de vente obligatoire"),
});

type ObjectFormType = z.infer<typeof objectSchema>;

export default function SellObjectForm() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ObjectFormType>({
        resolver: zodResolver(objectSchema),
    });

    const onSubmit = (data: ObjectFormType) => {
        console.log("Form Data:", data);
    };

    return (
     <div className="bg-white rounded-lg shadow-xl p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl mx-auto flex flex-col gap-6 p-4"
      >
        <h2 className="text-2xl font-semibold text-VioletC text-center font-cormorant">
          Ajouter un objet
        </h2>

        <InputForm
          label="Nom de l'objet *"
          id="name"
          type="text"
          placeholder="Ex: Vase chinois XVIIIe"
          error={errors.name}
          {...register("name")}
        />

        <div>
          <label className="block text-sm mb-1 font-raleway">Catégorie *</label>
          <select
            {...register("category")}
            className="w-full border border-BeigeC p-3 rounded-sm bg-white text-sm"
          >
            <option value="">Sélectionnez une catégorie</option>
            <option value="peinture">Peinture</option>
            <option value="sculpture">Sculpture</option>
            <option value="montre">Montre</option>
            <option value="bijoux">Bijoux</option>
            <option value="mobilier">Mobilier</option>
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <InputForm
            label="Hauteur (cm) *"
            placeholder="0"
            type="number"
            id="height"
            error={errors.height}
            {...register("height")}
          />
          <InputForm
            label="Largeur (cm) *"
            placeholder="0"
            type="number"
            id="width"
            error={errors.width}
            {...register("width")}
          />
          <InputForm
            label="Profondeur (cm) *"
            placeholder="0"
            type="number"
            id="depth"
            error={errors.depth}
            {...register("depth")}
          />
        </div>

        <InputForm
          label="Poids (kg) *"
          placeholder="0"
          type="number"
          id="weight"
          error={errors.weight}
          {...register("weight")}
        />

        <div>
          <label className="block text-sm font-raleway mb-1">
            Description *
          </label>
          <textarea
            {...register("description")}
            rows={5}
            className="w-full border border-BeigeC p-3 rounded-sm text-sm"
            placeholder="Décrivez brièvement l’objet"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-raleway mb-1">
            Déposer des documents (certificats, preuves d&apos;achat…)
          </label>
          <input
            type="file"
            multiple
            {...register("documents")}
            className="w-full border border-BeigeC p-3 rounded-sm text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-raleway mb-1">
            Photos de l&apos;objet (min. 10) *
          </label>
          <input
            type="file"
            id="photos"
            multiple
            {...register("photos")}
            className="w-full border border-BeigeC p-3 rounded-sm text-sm bg-white"
          />
          {errors.photos?.message && (
            <p className="text-red-600 text-sm mt-1">
              {String(errors.photos.message)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 font-raleway">
            Mode de vente *
          </label>

          <div className="flex flex-col gap-3 md:flex-row md:gap-6">
            <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:border-VioletC transition">
              <input
                type="radio"
                value="enchere"
                {...register("saleMode")}
                className="h-4 w-4 text-VioletC"
              />
              <span className="text-sm font-raleway">Enchères</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:border-VioletC transition">
              <input
                type="radio"
                value="rapide"
                {...register("saleMode")}
                className="h-4 w-4 text-VioletC"
              />
              <span className="text-sm font-raleway">Vente rapide</span>
            </label>
          </div>

          {errors.saleMode && (
            <p className="text-red-600 text-sm mt-2">
              {errors.saleMode.message}
            </p>
          )}
        </div>

        <InputForm
          label="Prix souhaité (€) *"
          placeholder="Ex: 500"
          type="number"
          id="price"
          error={errors.price}
          {...register("price")}
        />

        <div className="flex justify-center mt-4">
          <Button variant="primary" size="md" type="submit" fullWidth={true}>
            Mettre en vente
          </Button>
        </div>
      </form>
      </div>
  )
}
