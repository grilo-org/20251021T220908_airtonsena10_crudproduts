"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Divider,
} from "@heroui/react";
import { toast } from "sonner";
import { Mail, LogIn, ArrowRight, Package, Shield, Zap } from "lucide-react";
import InputPassword from "@/components/Password";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const maybeAxios = err as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return (
      maybeAxios.response?.data?.message ||
      maybeAxios.message ||
      "Erro inesperado"
    );
  }
  return "Erro inesperado";
}

export default function LoginPage() {
  const router = useRouter();
  const { login: loginAction, isLoading } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      await loginAction(values);
      toast.success("Login realizado com sucesso! 🎉", {
        description: "Você será redirecionado em instantes...",
      });
      router.push("/");
    } catch (err: unknown) {
      toast.error("Falha no login", {
        description: extractErrorMessage(err),
      });
    }
  };

  const features = [
    {
      icon: Package,
      title: "Gerenciamento Completo",
      description: "CRUD completo de produtos com interface intuitiva",
    },
    {
      icon: Shield,
      title: "Seguro & Confiável",
      description: "Sistema seguro com autenticação robusta",
    },
    {
      icon: Zap,
      title: "Performance Otimizada",
      description: "Interface rápida e responsiva em todos os dispositivos",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-50 to-primary/5 dark:from-background dark:via-gray-900 dark:to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  CrudProdutos
                </h1>
                <p className="text-foreground-secondary">
                  Sistema de Gerenciamento
                </p>
              </div>
            </div>
            <p className="text-xl text-foreground-secondary leading-relaxed">
              Gerencie seus produtos de forma simples e eficiente com nossa
              plataforma moderna.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-xl bg-background-secondary/50 border border-border/50"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground-secondary">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border border-border/50 bg-background-secondary/95 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="text-center space-y-2">
                <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    CrudProdutos
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Bem-vindo
                </h2>
                <p className="text-foreground-secondary">
                  Entre na sua conta para continuar
                </p>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Input
                    {...register("email")}
                    type="email"
                    label="E-mail"
                    placeholder="seu@email.com"
                    startContent={
                      <Mail className="w-4 h-4 text-foreground-secondary" />
                    }
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                    variant="bordered"
                    radius="lg"
                    classNames={{
                      input: "text-sm",
                      inputWrapper:
                        "border-border/50 hover:border-border focus-within:border-primary",
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <InputPassword
                    {...register("password")}
                    label="Senha"
                    placeholder="••••••••"
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                    variant="bordered"
                    radius="lg"
                    classNames={{
                      input: "text-sm",
                      inputWrapper:
                        "border-border/50 hover:border-border focus-within:border-primary",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Checkbox
                    isSelected={rememberMe}
                    onValueChange={setRememberMe}
                    size="sm"
                    color="primary"
                  >
                    <span className="text-sm text-foreground-secondary">
                      Lembrar de mim
                    </span>
                  </Checkbox>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary-hover transition-colors"
                  >
                    Esqueci minha senha
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                  size="lg"
                  radius="lg"
                  isLoading={isLoading}
                  startContent={!isLoading && <LogIn className="w-4 h-4" />}
                  endContent={!isLoading && <ArrowRight className="w-4 h-4" />}
                >
                  {isLoading ? "Entrando..." : "Entrar na conta"}
                </Button>
              </form>

              <div className="relative">
                <Divider className="my-4" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-background-secondary px-3 text-sm text-foreground-secondary">
                    ou
                  </span>
                </div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-foreground-secondary">
                  Ainda não tem uma conta?
                </p>
                <Button
                  as={Link}
                  href="/register"
                  variant="bordered"
                  className="w-full border-border hover:border-primary hover:text-primary transition-all duration-200"
                  size="lg"
                  radius="lg"
                >
                  Criar nova conta
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
