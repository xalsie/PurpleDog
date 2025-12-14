import { UserRole } from "@/types";

const DASHBOARD_BY_ROLE: Record<UserRole, string> = {
  [UserRole.SELLER]: "/dashboard/particulier",
  [UserRole.PROFESSIONAL]: "/dashboard/pro",
  [UserRole.ADMIN]: "/dashboard/admin",
};

export function getDashboardPath(role?: UserRole | string | null): string {
  if (!role) return "/login";
  
  // Handle backend roles
  const normalizedRole: UserRole | string =
    role === 'PRIVATE' || role === 'SELLER' ? UserRole.SELLER :
    role === 'PROFESSIONAL' ? UserRole.PROFESSIONAL :
    role === 'ADMIN' ? UserRole.ADMIN :
    role;
  
  return DASHBOARD_BY_ROLE[normalizedRole as UserRole] ?? "/login";
}
