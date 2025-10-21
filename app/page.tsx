"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAuthGuard } from "@/hooks/useAuthprotect";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loading } from "@/components/Loading";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Chip,
  Avatar,
} from "@heroui/react";
import {
  Package,
  Plus,
  BarChart3,
  TrendingUp,
  Activity,
  ArrowRight,
  CheckCircle,
  Clock,
  Zap,
  Target,
} from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  color: "primary" | "secondary" | "success" | "warning" | "danger";
}

function DashboardCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: DashboardCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-error/10 text-error",
  };

  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-foreground-secondary",
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-background-secondary/60 backdrop-blur border border-border/50">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-foreground-secondary text-sm font-medium mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground mb-2">{value}</p>
            <p className={`text-xs font-medium ${changeColors[changeType]}`}>
              {change}
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: "primary" | "secondary" | "success";
}

function QuickAction({
  title,
  description,
  icon: Icon,
  href,
  color,
}: QuickActionProps) {
  const colorClasses = {
    primary: "hover:bg-primary/5 border-primary/20 hover:border-primary/40",
    secondary:
      "hover:bg-secondary/5 border-secondary/20 hover:border-secondary/40",
    success: "hover:bg-success/5 border-success/20 hover:border-success/40",
  };

  const iconColors = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
  };

  return (
    <Link href={href}>
      <Card
        className={`h-full cursor-pointer transition-all duration-200 hover:-translate-y-1 ${colorClasses[color]} border`}
      >
        <CardBody className="p-6 text-center space-y-4">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${iconColors[color]}`}
          >
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-foreground-secondary">{description}</p>
          </div>
          <ArrowRight className="w-4 h-4 mx-auto text-foreground-secondary" />
        </CardBody>
      </Card>
    </Link>
  );
}

interface RecentActivityItem {
  id: string;
  type: "create" | "update" | "delete";
  title: string;
  time: string;
  user: string;
}

function RecentActivityItem({ item }: { item: RecentActivityItem }) {
  const typeConfig = {
    create: { color: "success", icon: Plus, text: "criou" },
    update: { color: "warning", icon: Package, text: "atualizou" },
    delete: { color: "danger", icon: Package, text: "removeu" },
  };

  const config = typeConfig[item.type];

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
      <div
        className={`w-8 h-8 rounded-full bg-${config.color}/10 flex items-center justify-center`}
      >
        <config.icon className={`w-4 h-4 text-${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-medium">{item.user}</span> {config.text}{" "}
          <span className="font-medium">{item.title}</span>
        </p>
        <p className="text-xs text-foreground-secondary flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{item.time}</span>
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { isLoading, shouldRender } = useAuthGuard();

  const dashboardStats = [
    {
      title: "Total de Produtos",
      value: "124",
      change: "+12% vs mês passado",
      changeType: "positive" as const,
      icon: Package,
      color: "primary" as const,
    },
    {
      title: "Produtos Ativos",
      value: "98",
      change: "+8% vs mês passado",
      changeType: "positive" as const,
      icon: CheckCircle,
      color: "success" as const,
    },
    {
      title: "Visualizações",
      value: "2.4k",
      change: "+23% vs mês passado",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "secondary" as const,
    },
    {
      title: "Taxa de Conversão",
      value: "12.3%",
      change: "-2% vs mês passado",
      changeType: "negative" as const,
      icon: Target,
      color: "warning" as const,
    },
  ];

  const quickActions = [
    {
      title: "Novo Produto",
      description: "Cadastrar um novo produto no sistema",
      icon: Plus,
      href: "/products",
      color: "primary" as const,
    },
    {
      title: "Ver Métricas",
      description: "Acompanhar performance e estatísticas",
      icon: BarChart3,
      href: "/metrics",
      color: "secondary" as const,
    },
    {
      title: "Relatórios",
      description: "Gerar relatórios detalhados",
      icon: Activity,
      href: "/reports",
      color: "success" as const,
    },
  ];

  const recentActivity: RecentActivityItem[] = [
    {
      id: "1",
      type: "create",
      title: "Smartphone Galaxy X",
      time: "há 2 horas",
      user: "João Silva",
    },
    {
      id: "2",
      type: "update",
      title: "Notebook Gamer Pro",
      time: "há 4 horas",
      user: "Maria Santos",
    },
    {
      id: "3",
      type: "create",
      title: "Mouse Wireless Premium",
      time: "há 6 horas",
      user: "Pedro Costa",
    },
    {
      id: "4",
      type: "delete",
      title: "Teclado Mecânico RGB",
      time: "há 1 dia",
      user: "Ana Lima",
    },
  ];

  if (isLoading || !shouldRender) {
    return <Loading />;
  }

  const firstName = user?.name?.split(" ")[0] || "Usuário";
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Bom dia" : currentHour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-modern main-content">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <div className="absolute inset-0 bg-white rounded-full transform translate-x-32 -translate-y-32" />
              <div className="absolute inset-0 bg-white rounded-full transform translate-x-48 -translate-y-16 scale-75" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {greeting}, {firstName}! 👋
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Bem-vindo ao seu painel de controle. Aqui você encontra tudo
                    sobre seus produtos.
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-blue-100 text-sm">Último acesso</p>
                    <p className="font-semibold">Hoje, 14:30</p>
                  </div>
                  <Avatar
                    name={user?.name}
                    src={user?.avatar}
                    className="w-12 h-12 border-2 border-white/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <DashboardCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="xl:col-span-2">
            <Card className="shadow-md bg-background-secondary/60 backdrop-blur border border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Ações Rápidas
                    </h2>
                    <p className="text-foreground-secondary text-sm">
                      Acesse rapidamente as principais funcionalidades
                    </p>
                  </div>
                  <Chip size="sm" variant="flat" color="primary">
                    3 disponíveis
                  </Chip>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <QuickAction key={index} {...action} />
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="shadow-md h-full bg-background-secondary/60 backdrop-blur border border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Atividade Recente
                  </h2>
                  <Button variant="light" size="sm" as={Link} href="/activity">
                    Ver tudo
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="space-y-2">
                {recentActivity.map((item) => (
                  <RecentActivityItem key={item.id} item={item} />
                ))}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Getting Started Guide */}
        <Card className="shadow-md bg-background-secondary/60 backdrop-blur border border-border/50 mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>Guia de Início Rápido</span>
                </h2>
                <p className="text-foreground-secondary text-sm">
                  Configure seu primeiro produto em menos de 2 minutos
                </p>
              </div>
              <Progress value={75} color="primary" size="sm" className="w-24" />
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-success/5 border border-success/20">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Conta Criada
                  </h3>
                  <p className="text-xs text-foreground-secondary">
                    Sua conta foi configurada com sucesso
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg bg-success/5 border border-success/20">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Perfil Completo
                  </h3>
                  <p className="text-xs text-foreground-secondary">
                    Informações básicas preenchidas
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg bg-warning/5 border border-warning/20">
                <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Primeiro Produto
                  </h3>
                  <p className="text-xs text-foreground-secondary">
                    <Link
                      href="/products"
                      className="text-primary hover:underline"
                    >
                      Cadastre seu primeiro produto
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-border">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300 text-xs font-bold">
                    4
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Configurar Métricas
                  </h3>
                  <p className="text-xs text-foreground-secondary">
                    Acompanhar performance dos produtos
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
