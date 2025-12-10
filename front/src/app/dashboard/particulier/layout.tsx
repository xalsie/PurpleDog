"use client";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/lib/routes";
import { useEffect } from "react";
import { UserRole } from "@/types";

const REQUIRED_ROLE = UserRole.SELLER;

export default function DashboardParticulierLayout({ children }: { children: React.ReactNode }) {
  const { userRole, isAuthenticated } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (userRole !== REQUIRED_ROLE) {
      router.replace(getDashboardPath(userRole));
    }
  }, [isAuthenticated, userRole, router]);

  if (!isAuthenticated || userRole !== REQUIRED_ROLE) {
    return null;
  }
  return <>{children}</>;
}
