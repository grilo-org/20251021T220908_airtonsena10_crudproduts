"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth";

export function useAuth() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { token, user, loading, error, login, register, logout } = useAuthStore();

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  const isAuthenticated = isHydrated && !!token;
  const isLoading = !isHydrated || loading;

  return {
    isAuthenticated,
    isLoading,
    token,
    user,
    error,
    login,
    register,
    logout,
    isHydrated,
  };
}
