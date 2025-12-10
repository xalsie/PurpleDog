"use client";

import { useState } from "react";
import InputField from "@/components/UI/InputField/InputField";
import FileField from "@/components/UI/FileField/FileField";
import CheckboxField from "@/components/UI/CheckboxField/CheckboxField";
import { validatePassword } from "@/lib/ValidateService";

interface ProFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  siret: string;
  officialDoc: File | undefined;
  address: string;
  website: string;
  specialties: string;
  researchItems: string;
  socialLinks: string;
  cgvAccepted: boolean;
  newsletter: boolean;
}

interface ProFormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  siret?: string;
  officialDoc?: string;
  address?: string;
  specialties?: string;
  researchItems?: string;
  cgvAccepted?: string;
}

interface ProFormProps {
  FormMode: "login" | "register";
}

const initialData: ProFormData = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  companyName: "",
  siret: "",
  officialDoc: undefined,
  address: "",
  website: "",
  specialties: "",
  researchItems: "",
  socialLinks: "",
  cgvAccepted: false,
  newsletter: false,
};

export default function ProfessionalForm({ FormMode }: ProFormProps) {
  const [mode, setMode] = useState(FormMode);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<ProFormErrors>({});
  const [formError, setFormError] = useState("");

  const resetForm = (newMode: "login" | "register") => {
    setMode(newMode);
    setData(initialData);
    setErrors({});
    setFormError("");
  };

  const handleModeChange = (newMode: "login" | "register") => {
    if (newMode !== mode) resetForm(newMode);
  };

  const validate = () => {
    const newErrors: ProFormErrors = {};

    if (!data.email) newErrors.email = "Email requis";

    const pwdError = validatePassword(data.password);
    if (pwdError) newErrors.password = pwdError;

    if (mode === "register") {
      if (!data.firstName) newErrors.firstName = "Nom requis";
      if (!data.lastName) newErrors.lastName = "Prénom requis";
      if (!data.companyName) newErrors.companyName = "Dénomination obligatoire";
      if (!data.siret) newErrors.siret = "N° SIRET obligatoire";
      if (!data.officialDoc) newErrors.officialDoc = "Document obligatoire";
      if (!data.address) newErrors.address = "Adresse obligatoire";
      if (!data.specialties) newErrors.specialties = "Obligatoire";
      if (!data.researchItems) newErrors.researchItems = "Obligatoire";

      if (!data.cgvAccepted)
        newErrors.cgvAccepted = "Vous devez accepter les CGV.";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const validationResult = validate();
    setErrors(validationResult);
    if (Object.keys(validationResult).length > 0) {
      setFormError("Veuillez corriger les erreurs.");
      return;
    }

    // Appel API ici
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value, files } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    setData((prev) => ({
      ...prev,
      [name]:
        type === "file"
          ? files?.[0] ?? undefined
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 border border-violet-300">
      <h2 className="text-2xl font-bold text-violet-700 mb-4">
        {mode === "login" ? "Connexion Professionnel" : "Inscription Professionnelle"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <InputField
          label="Email"
          name="email"
          type="email"
          onChange={handleChange}
          error={errors.email}
          placeHolder="email"
        />

        <InputField
          label="Mot de passe"
          name="password"
          type="password"
          onChange={handleChange}
          error={errors.password}
          placeHolder="mot de passe"
        />

        {mode === "register" && (
          <>
            {/* Name */}
            <InputField
              label="Nom"
              name="lastName"
              type="text"
              onChange={handleChange}
              error={errors.lastName}
              placeHolder="Nom"
            />

            <InputField
              label="Prénom"
              name="firstName"
              type="text"
              onChange={handleChange}
              error={errors.firstName}
              placeHolder="Prénom"
            />

            <InputField
              label="Dénomination de l'entreprise"
              name="companyName"
              type="text"
              onChange={handleChange}
              error={errors.companyName}
              placeHolder="Entreprise"
            />

            <InputField
              label="Numéro SIRET"
              name="siret"
              type="text"
              onChange={handleChange}
              error={errors.siret}
              placeHolder="SIRET"
            />

            <FileField
              label="Document officiel (K-Bis, INSEE...)"
              name="officialDoc"
              onChange={handleChange}
              error={errors.officialDoc}
            />

            <InputField
              label="Adresse postale"
              name="address"
              type="text"
              onChange={handleChange}
              error={errors.address}
              placeHolder="Adresse"
            />

            <InputField
              label="Site internet"
              name="website"
              type="text"
              onChange={handleChange}
              placeHolder="Site internet"
            />

            <InputField
              label="Spécialités *"
              name="specialties"
              type="text"
              onChange={handleChange}
              error={errors.specialties}
              placeHolder="Vos spécialités"
            />

            <InputField
              label="Objets recherchés *"
              name="researchItems"
              type="text"
              onChange={handleChange}
              error={errors.researchItems}
              placeHolder="Objets recherchés"
            />

            <InputField
              label="Réseaux sociaux (optionnel)"
              name="socialLinks"
              type="text"
              onChange={handleChange}
              placeHolder="Réseaux sociaux"
            />

            <CheckboxField
              label="Accepter les CGV + Mandat d'apport"
              name="cgvAccepted"
              onChange={handleChange}
              error={errors.cgvAccepted}
            />

            <CheckboxField
              label="Newsletter + RGPD"
              name="newsletter"
              onChange={handleChange}
            />
          </>
        )}

        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 transition text-white p-2 rounded w-full font-semibold"
        >
          {mode === "login" ? "Se connecter" : "S'inscrire"}
        </button>
      </form>

      <div className="mb-4 text-sm text-violet-700">
        {mode === "login" ? (
          <p>
            Pas encore de compte ?{" "}
            <button
              type="button"
              onClick={() => handleModeChange("register")}
              className="underline font-semibold text-violet-900"
            >
              Cliquez ici
            </button>
          </p>
        ) : (
          <p>
            Déjà inscrit ?{" "}
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className="underline font-semibold text-violet-900"
            >
              Se connecter
            </button>
          </p>
        )}
      </div>

      {formError && (
        <p className="text-red-600 font-semibold mb-3">{formError}</p>
      )}

    </div>
  );
}
