"use client";

import React, { useEffect } from "react";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";

interface LoadingRedirectProps {
  open: boolean;
  to?: string;
  message?: string;
}

export function LoadingRedirect({ open, to = "/login", message = "Redirecionando..." }: LoadingRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    if (open) {
      router.replace(to);
    }
  }, [open, to, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
      <div className="bg-background rounded-lg p-6 shadow-lg flex items-center gap-3">
        <Spinner size="lg" />
        <span className="text-foreground">{message}</span>
      </div>
    </div>
  );
}


