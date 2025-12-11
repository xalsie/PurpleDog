"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthenticated, clearAuth } from "@/store/slices/authSlice";
import {
  setUser,
  clearUser,
  setLoading as setUserLoading,
  setUserRole,
} from "@/store/slices/userSlice";
import { storage } from "../lib/storage";
import { axiosInstance } from "../lib/axios";
import type { User } from "@/types";
export function useRestoreSession() {
  const dispatch = useDispatch();

  useEffect(() => {
    const restore = async () => {
      try {
        dispatch(setUserLoading(true));
        
        const storedToken = storage.getToken();
        if (!storedToken) return;
        dispatch(setAuthenticated(true));
        const { data } = await axiosInstance.get<{ user: User }>("/auth/me");
        dispatch(setUser(data.user));
        dispatch(setUserRole(data.user.role));
        
      } catch (err: any) {
        if (err.response?.status === 401) {
          storage.clearAll();
          dispatch(clearAuth());
          dispatch(clearUser());
        }
      } finally {
        dispatch(setUserLoading(false));
      }
    };

    restore();
  }, [dispatch]);
}