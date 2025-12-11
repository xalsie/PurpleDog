"use client";

import { useState } from "react";
import InputField from "@/components/ui/InputField/InputField";
import FileField from "@/components/ui/FileField/FileField";
import CheckboxField from "@/components/ui/CheckboxField/CheckboxField";
import { validatePassword } from "../../../lib/ValidateService";

interface ParticularFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  profilePhoto: File | undefined;
  ageConfirmed: boolean;
  newsletter: boolean;
}

interface ParticularFormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  profilePhoto?: string;
  ageConfirmed?: string;
}

interface ParticularFormProps {
  FormMode: "login" | "register";
}

const initialData: ParticularFormData = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  address: "",
  profilePhoto: undefined,
  ageConfirmed: false,
  newsletter: false,
};

const initialErrors: ParticularFormErrors = {};

export default function ParticularForm({ FormMode }: ParticularFormProps) {
    const [mode, setMode] = useState(FormMode);
    const [data, setData] = useState<ParticularFormData>(initialData);
    const [errors, setErrors] = useState<ParticularFormErrors>(initialErrors);
    const [formError, setFormError] = useState("");

    const resetForm = (newMode: "login" | "register") => {
        setMode(newMode);
        setData(initialData);
        setErrors(initialErrors);
        setFormError("");
    };

    const handleModeChange = (newMode: "login" | "register") => {
        if (newMode !== mode) resetForm(newMode);
    };

    const validate = () => {
        const newErrors: ParticularFormErrors = {};

        if (!data.email) newErrors.email = "Email requis";
        const pwdVerif = validatePassword(data.password)
        if (pwdVerif) newErrors.password =pwdVerif;

        if (mode === "register") {
        if (!data.firstName) newErrors.firstName = "Nom requis";
        if (!data.lastName) newErrors.lastName = "Prénom requis";
        if (!data.address) newErrors.address = "Adresse requise";

        if (!data.profilePhoto) newErrors.profilePhoto = "Photo requise";

        if (!data.ageConfirmed) newErrors.ageConfirmed = "+18 obligatoire";
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
        {mode === "login" ? "Connexion" : "Inscription Particulier"}
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

            {/* Register only */}
            {mode === "register" && (
            <>
                <InputField
                type="text"
                label="Nom"
                name="firstName"
                onChange={handleChange}
                error={errors.firstName}
                placeHolder="nom"
                />

                <InputField
                type="text"
                label="Prénom"
                name="lastName"
                onChange={handleChange}
                error={errors.lastName}
                placeHolder="prénom"
                />

                <InputField
                type="text"
                label="Adresse postale"
                name="address"
                onChange={handleChange}
                error={errors.address}
                placeHolder="adresse"
                />

                <FileField
                label="Photo de profil"
                name="profilePhoto"
                onChange={handleChange}
                error={errors.profilePhoto}
                />

                <CheckboxField
                label="J'ai plus de 18 ans"
                name="ageConfirmed"
                onChange={handleChange}
                error={errors.ageConfirmed}
                />

                <CheckboxField
                label="Inscription newsletter + RGPD"
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

        {formError && (
            <p className="text-red-600 font-semibold mb-3">{formError}</p>
        )}
        
        <div className="mb-4 text-sm text-violet-600">
            {mode === "login" ? (
            <p>
                Pas de compte ?{" "}
                <button
                type="button"
                onClick={() => handleModeChange("register")}
                className="text-violet-800 underline font-semibold"
                >
                Cliquez ici
                </button>
            </p>
            ) : (
            <p>
                Déjà un compte ?{" "}
                <button
                type="button"
                onClick={() => handleModeChange("login")}
                className="text-violet-800 underline font-semibold"
                >
                Se connecter
                </button>
            </p>
            )}
        </div>
    </div>
  );
}
