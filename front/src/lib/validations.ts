import { z } from "zod";
import { UserRole } from "@/types";

const emailSchema = z
  .email("Veuillez entrer une adresse email valide")
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(/[A-Z]/, "Au moins une lettre majuscule requise")
  .regex(/[a-z]/, "Au moins une lettre minuscule requise")
  .regex(/[0-9]/, "Au moins un chiffre requis")
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Au moins un caractère spécial requis");

const nameSchema = z
  .string()
  .min(2, "Doit contenir au moins 2 caractères")
  .max(50, "Doit contenir au maximum 50 caractères");

const birthDateSchema = z.coerce.date().refine((date) => {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  return age >= 18;
}, "Vous devez avoir au moins 18 ans");

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Le mot de passe est requis"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Stepper schemas
export const stepEmailSchema = z.object({
  email: emailSchema,
});

export const stepPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
  type: z.enum([UserRole.SELLER, UserRole.PROFESSIONAL]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const stepParticularDetailsSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  birthDate: birthDateSchema,
});

export const stepProfessionalDetailsSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  birthDate: birthDateSchema,
  companyName: z.string().min(2, "Nom d'entreprise requis"),
  siret: z.string().regex(/^\d{14}$/, "SIRET invalide (14 chiffres)"),
  vat: z.string().min(5, "Numéro de TVA requis"),
});

export type StepEmailData = z.infer<typeof stepEmailSchema>;
export type StepPasswordData = z.infer<typeof stepPasswordSchema>;
export type StepParticularDetailsData = z.infer<typeof stepParticularDetailsSchema>;
export type StepProfessionalDetailsData = z.infer<typeof stepProfessionalDetailsSchema>;
