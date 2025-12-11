"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth/LoginForm";
import { useSession } from "@/hooks/useSession";
import { getDashboardPath } from "@/lib/routes";
import NavbarHome from "@/components/layout/NavBarHome/NavBarHome";

export default function LoginPage() {
  const { isAuthenticated, userRole } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(getDashboardPath(userRole));
    }
  }, [isAuthenticated, userRole, router]);

  if (isAuthenticated) return null;

  return(
    <div>
      <NavbarHome/>
      <LoginForm/>
    </div>
  )
}
