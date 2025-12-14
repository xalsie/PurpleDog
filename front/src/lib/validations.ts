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
  vat: z
    .string()
    .regex(
      /^((AT)(U\d{8})|(BE)(0\d{9})|(BG)(\d{9,10})|(CY)(\d{8}[LX])|(CZ)(\d{8,10})|(DE)(\d{9})|(DK)(\d{8})|(EE)(\d{9})|(EL|GR)(\d{9})|(ES)([\dA-Z]\d{7}[\dA-Z])|(FI)(\d{8})|(FR)([\dA-Z]{2}\d{9})|(HU)(\d{8})|(IE)(\d{7}[A-Z]{2})|(IT)(\d{11})|(LT)(\d{9}|\d{12})|(LU)(\d{8})|(LV)(\d{11})|(MT)(\d{8})|(NL)(\d{9}(B\d{2}|BO2))|(PL)(\d{10})|(PT)(\d{9})|(RO)(\d{2,10})|(SE)(\d{12})|(SI)(\d{8})|(SK)(\d{10}))$/i,
      "Numéro de TVA invalide",
    ),
});

export type StepEmailData = z.infer<typeof stepEmailSchema>;
export type StepPasswordData = z.infer<typeof stepPasswordSchema>;
export type StepParticularDetailsData = z.infer<typeof stepParticularDetailsSchema>;
export type StepProfessionalDetailsData = z.infer<typeof stepProfessionalDetailsSchema>;

// Item form validation
const preprocessNumber = (value: unknown) => {
  if (value === "" || value === null || typeof value === "undefined") return undefined;
  if (typeof value === "number") return value;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isNaN(parsed) ? undefined : parsed;
};

const requiredPositive = (message: string) =>
  z.preprocess(preprocessNumber, z.number().positive(message));

const optionalPositive = () =>
  z.preprocess(preprocessNumber, z.number().positive().optional());

export const itemFormSchema = z.object({
  name: z.string().trim().min(2, "Titre requis (min 2 caractères)"),
  category: z.array(z.string()).min(1, "Catégorie requise"),
  description: z.string().trim().min(10, "Description trop courte"),
  sale_type: z.enum(["AUCTION", "QUICK_SALE"], { message: "Type de vente requis" }),
  dimensions: z.object({
    height: z.number().positive().optional(),
    width: z.number().positive().optional(),
    depth: z.number().positive().optional(),
  }).optional(),
  weight_kg: optionalPositive(),
  
  desired_price: z.number().positive("Prix requis").optional(),
  starting_price: z.number().positive("Prix de départ requis").optional(),
  min_price_accepted: optionalPositive(),
  
  ai_estimated_price: optionalPositive(),
  mediaIds: z.array(z.string()).min(1, "Ajoutez au moins une photo"),
  analysisCategory: z.string().trim().optional(),
}).refine((data) => {
  // For QUICK_SALE: desired_price is optional but if provided must be > 0
  // For AUCTION: starting_price is optional but if provided must be > 0
  // Both are optional, so form can submit without prices
  return true;
}, {
  message: "Vérifiez les champs de prix",
  path: ["sale_type"],
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;

export const defaultItemFormValues: Partial<ItemFormValues> = {
  name: "",
  description: "",
  sale_type: "AUCTION",
  mediaIds: [],
  analysisCategory: "",
  category: [],
  dimensions: {
    height: undefined,
    width: undefined,
    depth: undefined,
  },
  weight_kg: undefined,
  desired_price: undefined,
  starting_price: undefined,
  ai_estimated_price: undefined,
  min_price_accepted: undefined,
};
