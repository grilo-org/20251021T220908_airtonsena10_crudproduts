"use client";

import { useMemo } from "react";

export type MonthlyMetric = {
  month: string;
  sold: number;
  revenue: number; // em R$
};

export type DistributionItem = {
  name: string;
  value: number;
};

export function useProductMetrics() {
  // Dados mockados simples, relacionados a produtos
  const monthly: MonthlyMetric[] = useMemo(
    () => [
      { month: "Jan", sold: 32, revenue: 4200 },
      { month: "Fev", sold: 28, revenue: 3800 },
      { month: "Mar", sold: 41, revenue: 5150 },
      { month: "Abr", sold: 35, revenue: 4700 },
      { month: "Mai", sold: 50, revenue: 6300 },
      { month: "Jun", sold: 46, revenue: 5920 },
    ],
    []
  );

  // Distribuição simples de status de produtos
  const stockDistribution: DistributionItem[] = useMemo(
    () => [
      { name: "Em estoque", value: 120 },
      { name: "Esgotado", value: 24 },
      { name: "Inativo", value: 12 },
    ],
    []
  );

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]; // azul, verde, amarelo, vermelho, roxo

  return {
    monthly,
    stockDistribution,
    colors,
    isLoading: false,
  };
}


