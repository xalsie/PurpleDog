"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { storage } from "../lib/storage";
import { UserRole } from "@/types";

export function useSession() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { user, userRole } = useSelector((state: RootState) => state.user);

  const token = storage.getToken();

  return {
    token,
    user,
    userRole,
    isAuthenticated,
    isAdmin: userRole === UserRole.ADMIN,
    isClient: userRole === UserRole.SELLER,
  };
}
