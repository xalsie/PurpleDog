"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  setAuthenticated,
  clearAuth,
  setLoading as setAuthLoading,
  setError as setAuthError,
} from "@/store/slices/authSlice";
import {
  setUser,
  clearUser,
  setLoading as setUserLoading,
  setUserRole,
} from "@/store/slices/userSlice";
import {
  User,
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  UserRole,
} from "@/types";
import { storage } from "@/lib/storage";
import { axiosInstance } from "@/lib/axios";
import { getDashboardPath } from "@/lib/routes";
import { RootState, AppDispatch } from "@/store";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, error: authError } = useSelector(
    (state: RootState) => state.auth
  );
  const { user, isLoading: userLoading, error: userError } = useSelector(
    (state: RootState) => state.user
  );

  const isLoading = authLoading || userLoading;
  const error = authError || userError;

  const mapBackendRole = (backendRole: string): UserRole => {
    if (backendRole === 'PROFESSIONAL' || backendRole === 'professional') return UserRole.PROFESSIONAL;
    if (backendRole === 'SELLER' || backendRole === 'seller' || backendRole === 'PRIVATE' || backendRole === 'particulier') return UserRole.SELLER;
    if (backendRole === 'ADMIN' || backendRole === 'admin') return UserRole.ADMIN;
    return UserRole.SELLER; // default
  };

  const login = useCallback(
    async (payload: LoginPayload): Promise<boolean> => {
      try {
        dispatch(setAuthLoading(true));
        dispatch(setAuthError(null));

        const response = await axiosInstance.post<any>("/auth/login", payload);
        const token = response.data?.access_token || response.data?.token || response.data;

        if (!token || typeof token !== "string") {
          throw new Error("Token manquant dans la réponse");
        }

        storage.saveToken(token);
        dispatch(setAuthenticated(true));

        // Fetch user data after login
        dispatch(setUserLoading(true));
        try {
          const userResponse = await axiosInstance.get<any>("/auth/me");
          const mappedRole = mapBackendRole(userResponse.data.role);
          const mappedUser = { ...userResponse.data, role: mappedRole };
          dispatch(setUser(mappedUser));
          dispatch(setUserRole(mappedRole));
          router.push(getDashboardPath(mappedRole));
        } finally {
          dispatch(setUserLoading(false));
        }

        return true;
      } catch (err) {
        const errorMessage = (err as unknown as { response?: { data?: { error?: string } } })?.response?.data?.error || "Login failed";
        dispatch(setAuthError(errorMessage));
        return false;
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [dispatch, router]
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<boolean> => {
      try {
        dispatch(setAuthLoading(true));
        dispatch(setAuthError(null));

        await axiosInstance.post("/auth", payload);

        // After successful registration, login the user
        const loginPayload: LoginPayload = {
          email: payload.email,
          password: payload.password,
        };
        return await login(loginPayload);
      } catch (err) {
        const errorMessage = (err as unknown as { response?: { data?: { error?: string } } })?.response?.data?.error || "Registration failed";
        dispatch(setAuthError(errorMessage));
        return false;
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [dispatch, login]
  );

  const registerUser = useCallback(
    async (payload: any, role: UserRole): Promise<boolean> => {
      try {
        dispatch(setAuthLoading(true));
        dispatch(setAuthError(null));

        await axiosInstance.post("/auth", { role, ...payload });

        // Registration successful - redirect to login page
        router.push("/login");
        return true;
      } catch (err) {
        const errorMessage = (err as unknown as { response?: { data?: { error?: string } } })?.response?.data?.error || "Registration failed";
        dispatch(setAuthError(errorMessage));
        return false;
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [dispatch, router]
  );

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout").catch(() => {
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      storage.clearAll();

      dispatch(clearAuth());
      dispatch(clearUser());
      dispatch(setUserRole(null));
      router.push("/login");
    }
  }, [dispatch, router]);

  const restoreSession = useCallback(async () => {
    try {
      dispatch(setUserLoading(true));

      const storedToken = storage.getToken();
      if (!storedToken) {
        return;
      }
      dispatch(setAuthenticated(true));
      try {
        const response = await axiosInstance.get<any>("/auth/me");
        const mappedRole = mapBackendRole(response.data.role);
        const mappedUser = { ...response.data, role: mappedRole };
        dispatch(setUser(mappedUser));
        dispatch(setUserRole(mappedRole));
      } catch (fetchErr) {
        const error = fetchErr as unknown as { response?: { status?: number } };
        if (error.response?.status === 401) {
          // Token is invalid
          storage.clearAll();
          dispatch(clearAuth());
          dispatch(clearUser());
        } else if (error.response?.status === 404) {
          console.warn("[restoreSession] /auth/me endpoint not found (404)");
        }
      }
    } catch (err) {
      console.error("[restoreSession] error:", err);
    } finally {
      dispatch(setUserLoading(false));
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    registerUser,
    logout,
    restoreSession,
    isAdmin: user?.role === UserRole.ADMIN,
    isClient: user?.role === UserRole.SELLER,
  };
};
