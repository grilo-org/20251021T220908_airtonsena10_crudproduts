"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Progress,
} from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useProductMetrics } from "../../hooks/useProductMetrics";
import { useAuthGuard } from "../../hooks/useAuthprotect";
import { Spinner } from "@heroui/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  TrendingUp,
  BarChart3,
  Activity,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type ChartType = "bar" | "line" | "area";
type TimeRange = "7d" | "30d" | "90d" | "1y";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  subtitle?: string;
  trend?: number[];
}

const MetricCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  subtitle,
  trend,
}: MetricCardProps) => (
  <Card className="border-0 bg-gradient-to-br from-background-secondary/50 to-background-secondary/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
    <CardBody className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <p className="text-sm text-foreground-secondary font-medium">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              changeType === "positive"
                ? "bg-success/10 text-success"
                : changeType === "negative"
                  ? "bg-danger/10 text-danger"
                  : "bg-default/10 text-foreground-secondary"
            }`}
          >
            {changeType === "positive" ? (
              <ArrowUpRight size={12} />
            ) : changeType === "negative" ? (
              <ArrowDownRight size={12} />
            ) : null}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-sm text-foreground-secondary mb-3">{subtitle}</p>
      )}

      {trend && (
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend.map((value, index) => ({ value, index }))}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#trendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </CardBody>
  </Card>
);

export default function MetricsPage() {
  const { isLoading: authLoading, shouldRender } = useAuthGuard();
  const { monthly, stockDistribution, colors } = useProductMetrics();

  const [chartType, setChartType] = useState<ChartType>("bar");
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data para as métricas
  const metrics = {
    totalRevenue: {
      value: "R$ 156.420",
      change: 12.5,
      changeType: "positive" as const,
    },
    totalProducts: {
      value: "2.847",
      change: 8.3,
      changeType: "positive" as const,
    },
    totalOrders: {
      value: "1.234",
      change: -3.2,
      changeType: "negative" as const,
    },
    activeUsers: {
      value: "892",
      change: 15.8,
      changeType: "positive" as const,
    },
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular loading
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    //mocado
    console.log("Exportando dados...");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background-secondary">
        <div className="text-center space-y-4">
          <Spinner size="lg" color="primary" />
          <p className="text-foreground-secondary">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!shouldRender) {
    return null;
  }

  const renderChart = () => {
    const commonProps = {
      data: monthly,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background-secondary))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="sold"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background-secondary))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="sold"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorSold)"
            />
          </AreaChart>
        );

      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background-secondary))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar
              dataKey="sold"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-secondary">
      <Header />

      <div className="container-modern">
        <div className="space-y-5">
          {/* Header da página */}
          <div className="text-center py-16 animate-fade-in">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight animate-slide-up">
                  Métricas & Insights
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    size="lg"
                    startContent={<Calendar size={18} />}
                    className="font-medium"
                  >
                    {timeRange === "7d"
                      ? "Últimos 7 dias"
                      : timeRange === "30d"
                        ? "Últimos 30 dias"
                        : timeRange === "90d"
                          ? "Últimos 90 dias"
                          : "Último ano"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  onAction={(key) => setTimeRange(key as TimeRange)}
                  className="min-w-[200px]"
                >
                  <DropdownItem key="7d">Últimos 7 dias</DropdownItem>
                  <DropdownItem key="30d">Últimos 30 dias</DropdownItem>
                  <DropdownItem key="90d">Últimos 90 dias</DropdownItem>
                  <DropdownItem key="1y">Último ano</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Button
                variant="flat"
                size="lg"
                isIconOnly
                onPress={handleRefresh}
                isLoading={isRefreshing}
                className="w-12 h-12"
              >
                <RefreshCw size={18} />
              </Button>

              <Button
                color="primary"
                size="lg"
                startContent={<Download size={18} />}
                onPress={handleExport}
                className="font-medium px-8"
              >
                Exportar Relatório
              </Button>
            </div>
          </div>

          {/* Cards de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
            <MetricCard
              title="Receita Total"
              value={metrics.totalRevenue.value}
              change={metrics.totalRevenue.change}
              changeType={metrics.totalRevenue.changeType}
              icon={<DollarSign size={24} />}
              subtitle="vs. período anterior"
              trend={[100, 120, 110, 140, 160, 150, 180]}
            />

            <MetricCard
              title="Produtos Ativos"
              value={metrics.totalProducts.value}
              change={metrics.totalProducts.change}
              changeType={metrics.totalProducts.changeType}
              icon={<Package size={24} />}
              subtitle="produtos cadastrados"
              trend={[80, 95, 110, 105, 125, 140, 130]}
            />

            <MetricCard
              title="Pedidos"
              value={metrics.totalOrders.value}
              change={metrics.totalOrders.change}
              changeType={metrics.totalOrders.changeType}
              icon={<ShoppingCart size={24} />}
              subtitle="no período"
              trend={[120, 110, 100, 95, 90, 85, 95]}
            />

            <MetricCard
              title="Usuários Ativos"
              value={metrics.activeUsers.value}
              change={metrics.activeUsers.change}
              changeType={metrics.activeUsers.changeType}
              icon={<Users size={24} />}
              subtitle="últimos 30 dias"
              trend={[60, 70, 85, 90, 110, 120, 140]}
            />
          </div>

          {/* Gráficos principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
            {/* Gráfico de vendas */}
            <Card className="border-0 bg-background-secondary/30 backdrop-blur-sm">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Produtos Vendidos
                    </h3>
                    <p className="text-sm text-foreground-secondary">
                      Evolução mensal
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={chartType === "bar" ? "solid" : "flat"}
                      color={chartType === "bar" ? "primary" : "default"}
                      isIconOnly
                      onPress={() => setChartType("bar")}
                    >
                      <BarChart3 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant={chartType === "line" ? "solid" : "flat"}
                      color={chartType === "line" ? "primary" : "default"}
                      isIconOnly
                      onPress={() => setChartType("line")}
                    >
                      <TrendingUp size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant={chartType === "area" ? "solid" : "flat"}
                      color={chartType === "area" ? "primary" : "default"}
                      isIconOnly
                      onPress={() => setChartType("area")}
                    >
                      <Activity size={16} />
                    </Button>
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>

            {/* Gráfico de receita */}
            <Card className="border-0 bg-background-secondary/30 backdrop-blur-sm">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Receita Mensal
                    </h3>
                    <p className="text-sm text-foreground-secondary">
                      Faturamento em R$
                    </p>
                  </div>

                  <Chip color="success" variant="flat" size="sm">
                    <TrendingUp size={12} className="mr-1" />
                    +12.5%
                  </Chip>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthly}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="revenueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--success))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--success))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip
                        formatter={(v: number) => [
                          `R$ ${v.toLocaleString("pt-BR")}`,
                          "Receita",
                        ]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--background-secondary))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--success))"
                        strokeWidth={3}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Distribuição de estoque e insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
            {/* Gráfico de pizza */}
            <Card className="lg:col-span-2 border-0 bg-background-secondary/30 backdrop-blur-sm">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Distribuição de Estoque
                    </h3>
                    <p className="text-sm text-foreground-secondary">
                      Por categoria
                    </p>
                  </div>

                  <Button
                    variant="flat"
                    size="sm"
                    startContent={<Eye size={16} />}
                  >
                    Ver Detalhes
                  </Button>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={40}
                        paddingAngle={5}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {stockDistribution.map((_, i) => (
                          <Cell key={i} fill={colors[i % colors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(v: number) => [`${v}`, "Quantidade"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--background-secondary))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>

            {/* Insights e metas */}
            <Card className="border-0 bg-background-secondary/30 backdrop-blur-sm">
              <CardBody className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Metas do Mês
                </h3>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Vendas
                      </span>
                      <span className="text-sm text-foreground-secondary">
                        850/1000
                      </span>
                    </div>
                    <Progress value={85} color="success" size="sm" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Receita
                      </span>
                      <span className="text-sm text-foreground-secondary">
                        R$ 75k/100k
                      </span>
                    </div>
                    <Progress value={75} color="primary" size="sm" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Novos Clientes
                      </span>
                      <span className="text-sm text-foreground-secondary">
                        120/150
                      </span>
                    </div>
                    <Progress value={80} color="secondary" size="sm" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Estoque
                      </span>
                      <span className="text-sm text-foreground-secondary">
                        60/100
                      </span>
                    </div>
                    <Progress value={60} color="warning" size="sm" />
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TrendingUp size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Insight
                      </p>
                      <p className="text-xs text-foreground-secondary mt-1">
                        Suas vendas aumentaram 12% este mês. Continue assim!
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
