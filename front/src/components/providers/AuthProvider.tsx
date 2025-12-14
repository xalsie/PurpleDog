"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";

const AuthReadyContext = createContext<boolean>(false);

export function useAuthReady() {
  return useContext(AuthReadyContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const dispatch = useDispatch();
  const { restoreSession } = useAuth();
  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    restoreSession().finally(() => {
      setAuthReady(true);
    });
  }, [restoreSession]);

  return (
    <AuthReadyContext.Provider value={authReady}>
      {children}
    </AuthReadyContext.Provider>
  );
}
