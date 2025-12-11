"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { InputForm } from "@/components/ui";
import { Button } from "@/components/ui"

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

export function LoginForm() {
  const { login, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-BeigeC px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-sm shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-gamora text-gray-800 text-center">
              Purple Dog
            </h1>
            <p className="text-gray-600 text-center mt-2 font-raleway">
              Connexion
            </p>
          </div>

          <FormError message={error} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
            <InputForm
              label="Email"
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              {...register("email")}
              error={errors.email}
            />

            <InputForm
              label="Mot de passe"
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password}
            />

            {/* Submit Button */}
            <Button variant="primary" size="md" type="submit" disabled={isLoading} className="mx-auto">
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Vous n&apos;avez pas de compte ?{" "}
              <Link href="/register" className="text-VioletC hover:underline font-semibold font-raleway">
                Inscrivez-vous
              </Link>
            </p>
          </div>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-gray-500 hover:text-gray-700 text-sm font-raleway">
              Mot de passe oublié?
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
