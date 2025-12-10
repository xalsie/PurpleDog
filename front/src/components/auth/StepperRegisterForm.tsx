"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { axiosInstance } from "@/lib/axios";
import { UserRole } from "@/types";
import {
  stepEmailSchema,
  stepPasswordSchema,
  stepParticularDetailsSchema,
  stepProfessionalDetailsSchema,
  StepEmailData,
  StepPasswordData,
  StepParticularDetailsData,
  StepProfessionalDetailsData,
} from "@/lib/validations";
import { InputField } from "@/components/UI";

interface FormErrorProps {
  message?: string | null;
}

function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return (
    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p className="text-sm">{message}</p>
    </div>
  );
}

type StepType = "email" | "password" | "details";

interface StepperRegisterFormProps {
  onBack?: () => void;
}

export function StepperRegisterForm({ onBack }: StepperRegisterFormProps) {
  const { registerUser, isLoading, error } = useAuth();
  const [currentStep, setCurrentStep] = useState<StepType>("email");
  const [emailValue, setEmailValue] = useState("");
  const [userType, setUserType] = useState<UserRole.SELLER | UserRole.PROFESSIONAL | null>(null);
  const [passwordData, setPasswordData] = useState<{ password: string; confirmPassword: string } | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // step 1: email
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm<StepEmailData>({
    resolver: zodResolver(stepEmailSchema),
  });

  // step 2: password + Type
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    watch: watchPassword,
  } = useForm<StepPasswordData>({
    resolver: zodResolver(stepPasswordSchema),
    defaultValues: {
      type: UserRole.SELLER,
    },
  });

  // step 3: particular Details
  const {
    register: registerParticularDetails,
    handleSubmit: handleSubmitParticularDetails,
    formState: { errors: errorsParticularDetails },
  } = useForm<StepParticularDetailsData, any, StepParticularDetailsData>({
    resolver: zodResolver(stepParticularDetailsSchema) as Resolver<StepParticularDetailsData, any, StepParticularDetailsData>,
  });

  // step 3: professional Details
  const {
    register: registerProfessionalDetails,
    handleSubmit: handleSubmitProfessionalDetails,
    formState: { errors: errorsProfessionalDetails },
  } = useForm<StepProfessionalDetailsData, any, StepProfessionalDetailsData>({
    resolver: zodResolver(stepProfessionalDetailsSchema) as Resolver<StepProfessionalDetailsData, any, StepProfessionalDetailsData>,
  });

  const onSubmitEmail = async (data: StepEmailData) => {
    setLocalError(null);
    try {
      const response = await axiosInstance.get<{ exists: boolean; role?: UserRole }>(
        `/auth/check-email/${encodeURIComponent(data.email)}`
      );
      console.log(response);
      

      if (response.data.exists && response.data.role) {
        setLocalError(
          `Ce compte existe déjà. Veuillez vous connecter.`
        );
        return;
      }

      setEmailValue(data.email);
      setCurrentStep("password");
    } catch (err: any) {
      setLocalError(err?.response?.data?.error || "Erreur lors de la vérification de l'email");
    }
  };

  const onSubmitPassword = async (data: StepPasswordData) => {
    setPasswordData({ password: data.password, confirmPassword: data.confirmPassword });
    setUserType(data.type);
    setCurrentStep("details");
  };

  const formatBirthDate = (date?: Date) => {
    if (!date) return undefined;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onSubmitParticularDetails: SubmitHandler<StepParticularDetailsData> = async (data) => {
    if (!passwordData || !emailValue) return;

    const success = await registerUser(
      {
        email: emailValue,
        password: passwordData.password,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: formatBirthDate(data.birthDate),
        address: "", // Will be filled later in profile
        ageConfirmed: true, // still provide flag
        newsletter: false,
      },
      UserRole.SELLER
    );

    // useAuth hook handles redirect on success
  };

  const onSubmitProfessionalDetails: SubmitHandler<StepProfessionalDetailsData> = async (data) => {
    if (!passwordData || !emailValue) return;

    const success = await registerUser(
      {
        email: emailValue,
        password: passwordData.password,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: formatBirthDate(data.birthDate),
        companyName: data.companyName,
        siret: data.siret,
        vat: data.vat,
        address: "", // Will be filled later in profile
        cgvAccepted: true, // Implicit for registration
        newsletter: false,
      },
      UserRole.PROFESSIONAL
    );

    // useAuth hook handles redirect on success
  };

  const selectedType = watchPassword("type");

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 to-purple-700 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Purple Dog</h1>
            <p className="text-gray-600 mt-2">Inscription</p>
          </div>

          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === "email"
                      ? "bg-purple-600 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {currentStep === "email" ? "1" : "✓"}
                </div>
                <p className="text-xs mt-2 text-gray-600">Email</p>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-2">
                <div
                  className={`h-full ${
                    currentStep !== "email" ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === "password"
                      ? "bg-purple-600 text-white"
                      : currentStep === "details"
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {currentStep === "details" ? "✓" : "2"}
                </div>
                <p className="text-xs mt-2 text-gray-600">Type & Mot de passe</p>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-2">
                <div
                  className={`h-full ${
                    currentStep === "details" ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === "details"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  3
                </div>
                <p className="text-xs mt-2 text-gray-600">Détails</p>
              </div>
            </div>
          </div>

          <FormError message={localError || error} />

          {/* Step 1: Email */}
          {currentStep === "email" && (
            <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
              <InputField
                label="Adresse email"
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                {...registerEmail("email")}
                error={errorsEmail.email}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </form>
          )}

          {/* Step 2: Password + Type */}
          {currentStep === "password" && (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> {emailValue}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de compte
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition hover:border-purple-600">
                    <input
                      type="radio"
                      value={UserRole.SELLER}
                      {...registerPassword("type")}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Particulier</span>
                  </label>
                  <label className="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition hover:border-purple-600">
                    <input
                      type="radio"
                      value={UserRole.PROFESSIONAL}
                      {...registerPassword("type")}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Professionnel</span>
                  </label>
                </div>
                {errorsPassword.type && (
                  <p className="text-red-600 text-sm mt-1">{errorsPassword.type.message}</p>
                )}
              </div>

              <InputField
                label="Mot de passe"
                id="password"
                type="password"
                placeholder="••••••••"
                {...registerPassword("password")}
                error={errorsPassword.password}
                helperText="Min. 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial"
              />

              <InputField
                label="Confirmer mot de passe"
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...registerPassword("confirmPassword")}
                error={errorsPassword.confirmPassword}
              />

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("email")}
                  className="w-1/3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Details - Particular */}
          {currentStep === "details" && userType === UserRole.SELLER && (
            <form
              onSubmit={handleSubmitParticularDetails(onSubmitParticularDetails)}
              className="space-y-4"
            >
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> {emailValue}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Type:</strong> Particulier
                </p>
              </div>

              <InputField
                label="Prénom"
                id="firstName"
                type="text"
                placeholder="Jean"
                {...registerParticularDetails("firstName")}
                error={errorsParticularDetails.firstName}
              />

              <InputField
                label="Nom"
                id="lastName"
                type="text"
                placeholder="Dupont"
                {...registerParticularDetails("lastName")}
                error={errorsParticularDetails.lastName}
              />

              <InputField
                label="Date de naissance"
                id="birthDate"
                type="date"
                {...registerParticularDetails("birthDate")}
                error={errorsParticularDetails.birthDate}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  ℹ️ Les autres informations (adresse, photo, etc.) pourront être renseignées plus tard dans votre profil.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("password")}
                  className="w-1/3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Inscription en cours..." : "S'inscrire"}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Details - Professional */}
          {currentStep === "details" && userType === UserRole.PROFESSIONAL && (
            <form
              onSubmit={handleSubmitProfessionalDetails(onSubmitProfessionalDetails)}
              className="space-y-4"
            >
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> {emailValue}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Type:</strong> Professionnel
                </p>
              </div>

              <InputField
                label="Prénom"
                id="firstName"
                type="text"
                placeholder="Jean"
                {...registerProfessionalDetails("firstName")}
                error={errorsProfessionalDetails.firstName}
              />

              <InputField
                label="Nom"
                id="lastName"
                type="text"
                placeholder="Dupont"
                {...registerProfessionalDetails("lastName")}
                error={errorsProfessionalDetails.lastName}
              />

              <InputField
                label="Date de naissance"
                id="birthDate"
                type="date"
                {...registerProfessionalDetails("birthDate")}
                error={errorsProfessionalDetails.birthDate}
              />

              <InputField
                label="Nom de l'entreprise"
                id="companyName"
                type="text"
                placeholder="Ma Société SARL"
                {...registerProfessionalDetails("companyName")}
                error={errorsProfessionalDetails.companyName}
              />

              <InputField
                label="SIRET"
                id="siret"
                type="text"
                placeholder="12345678901234"
                {...registerProfessionalDetails("siret")}
                error={errorsProfessionalDetails.siret}
                helperText="14 chiffres"
              />

              <InputField
                label="Numéro de TVA"
                id="vat"
                type="text"
                placeholder="FRXX999999999"
                {...registerProfessionalDetails("vat")}
                error={errorsProfessionalDetails.vat}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  ℹ️ Les autres informations (KBIS, site web, spécialités, etc.) pourront être renseignées plus tard dans votre profil.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep("password")}
                  className="w-1/3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Inscription en cours..." : "S'inscrire"}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
