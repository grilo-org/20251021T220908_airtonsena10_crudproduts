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
  Progress,
} from "@heroui/react";
import { toast } from "sonner";
import {
  Mail,
 
  User,
  
  UserPlus,
  ArrowRight,
  Package,
  Shield,
  Zap,
  Check,
  X,
} from "lucide-react";
import InputPassword from "@/components/Password";
import { PhoneInput } from "../../../components/Phone";

const phoneSchema = z
  .object({
    country: z.string().optional(),
    ddd: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{2}$/.test(val), {
        message: "DDD deve conter exatamente 2 dígitos",
      }),
    number: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{8,9}$/.test(val), {
        message: "Número deve conter 8 ou 9 dígitos (sem DDD)",
      }),
  })
  .partial();

const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .regex(/[A-Za-z]/, "Senha deve conter pelo menos uma letra")
      .regex(/\d/, "Senha deve conter pelo menos um número"),
    verifyPassword: z.string().min(6, "Confirmação de senha obrigatória"),
    phone: phoneSchema.optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos de uso",
    }),
  })
  .refine((data) => data.password === data.verifyPassword, {
    path: ["verifyPassword"],
    message: "As senhas não coincidem",
  });

type RegisterForm = z.infer<typeof registerSchema>;

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

function PasswordStrengthIndicator({ password }: { password: string }) {
  const checks = [
    { label: "Mínimo 6 caracteres", test: password.length >= 6 },
    { label: "Contém uma letra", test: /[A-Za-z]/.test(password) },
    { label: "Contém um número", test: /\d/.test(password) },
    { label: "Mínimo 8 caracteres (recomendado)", test: password.length >= 8 },
  ];

  const passedChecks = checks.filter((check) => check.test).length;
  const strength = (passedChecks / checks.length) * 100;

  const getStrengthColor = () => {
    if (strength < 50) return "danger";
    if (strength < 75) return "warning";
    return "success";
  };

  const getStrengthText = () => {
    if (strength < 50) return "Fraca";
    if (strength < 75) return "Média";
    return "Forte";
  };

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-foreground-secondary">
          Força da senha:
        </span>
        <span className={`text-xs font-medium text-${getStrengthColor()}`}>
          {getStrengthText()}
        </span>
      </div>
      <Progress
        value={strength}
        color={getStrengthColor()}
        size="sm"
        className="max-w-full"
      />
      <div className="space-y-1">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center space-x-2">
            {check.test ? (
              <Check className="w-3 h-3 text-success" />
            ) : (
              <X className="w-3 h-3 text-gray-400" />
            )}
            <span
              className={`text-xs ${
                check.test ? "text-success" : "text-foreground-secondary"
              }`}
            >
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAction, isLoading, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      verifyPassword: "",
      terms: false,
    },
    mode: "onChange",
  });

  const watchedPassword = watch("password", "");
  const watchedName = watch("name", "");
  const watchedEmail = watch("email", "");

  const onSubmit = async (values: RegisterForm) => {
    try {
      await registerAction(values);
      toast.success("Cadastro realizado com sucesso! 🎉", {
        description: "Você será redirecionado para o dashboard...",
      });

      if (isAuthenticated) {
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (err: unknown) {
      toast.error("Falha no cadastro", {
        description: extractErrorMessage(err),
      });
    }
  };

  const handleNextStep = async () => {
    const isValid = await trigger(["name", "email"]);
    if (isValid && currentStep < 2) {
      setCurrentStep(currentStep + 1);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-50 to-secondary/5 dark:from-background dark:via-gray-900 dark:to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-secondary rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  CrudProdutos
                </h1>
                <p className="text-foreground-secondary">
                  Sistema de Gerenciamento
                </p>
              </div>
            </div>
            <p className="text-xl text-foreground-secondary leading-relaxed">
              Junte-se à nossa plataforma e comece a gerenciar seus produtos de
              forma profissional.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-xl bg-background-secondary/50 border border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-secondary" />
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

        {/* Right Side - Register Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border border-border/50 bg-background-secondary/95 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="text-center space-y-2">
                <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                    CrudProdutos
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Criar sua conta
                </h2>
                <p className="text-foreground-secondary">
                  Preencha os dados para começar
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center space-x-2 mt-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                    currentStep >= 1
                      ? "bg-secondary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-12 h-0.5 transition-all duration-200 ${
                    currentStep >= 2 ? "bg-secondary" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                    currentStep >= 2
                      ? "bg-secondary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
              </div>
            </CardHeader>

            <CardBody className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {currentStep === 1 && (
                  <div className="space-y-4 animate-slide-up">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Informações básicas
                    </h3>

                    <div className="space-y-1">
                      <Input
                        {...register("name")}
                        label="Nome completo"
                        placeholder="Seu nome completo"
                        startContent={
                          <User className="w-4 h-4 text-foreground-secondary" />
                        }
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}
                        variant="bordered"
                        radius="lg"
                        classNames={{
                          input: "text-sm",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:border-secondary",
                        }}
                      />
                    </div>

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
                            "border-border/50 hover:border-border focus-within:border-secondary",
                        }}
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full gradient-secondary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                      size="lg"
                      radius="lg"
                      isDisabled={
                        !watchedName ||
                        !watchedEmail ||
                        !!errors.name ||
                        !!errors.email
                      }
                      endContent={<ArrowRight className="w-4 h-4" />}
                    >
                      Continuar
                    </Button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        Segurança e contato
                      </h3>
                      <Button
                        type="button"
                        variant="light"
                        size="sm"
                        onPress={() => setCurrentStep(1)}
                      >
                        Voltar
                      </Button>
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
                            "border-border/50 hover:border-border focus-within:border-secondary",
                        }}
                      />
                      <PasswordStrengthIndicator password={watchedPassword} />
                    </div>

                    <div className="space-y-1">
                      <InputPassword
                        {...register("verifyPassword")}
                        label="Confirmar senha"
                        placeholder="••••••••"
                        isInvalid={!!errors.verifyPassword}
                        errorMessage={errors.verifyPassword?.message}
                        variant="bordered"
                        radius="lg"
                        classNames={{
                          input: "text-sm",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:border-secondary",
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <PhoneInput
                        setValue={setValue}
                        watch={watch}
                        errors={errors}
                      />
                    </div>

                    <div className="space-y-3">
                      <Checkbox
                        {...register("terms")}
                        isInvalid={!!errors.terms}
                        size="sm"
                        color="secondary"
                      >
                        <span className="text-sm text-foreground-secondary">
                          Aceito os{" "}
                          <Link
                            href="/terms"
                            className="text-secondary hover:text-secondary-hover underline"
                          >
                            termos de uso
                          </Link>{" "}
                          e{" "}
                          <Link
                            href="/privacy"
                            className="text-secondary hover:text-secondary-hover underline"
                          >
                            política de privacidade
                          </Link>
                        </span>
                      </Checkbox>
                      {errors.terms && (
                        <p className="text-xs text-error">
                          {errors.terms.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-secondary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                      size="lg"
                      radius="lg"
                      isLoading={isLoading}
                      startContent={
                        !isLoading && <UserPlus className="w-4 h-4" />
                      }
                    >
                      {isLoading ? "Criando conta..." : "Criar minha conta"}
                    </Button>
                  </div>
                )}
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
                  Já possui uma conta?
                </p>
                <Button
                  as={Link}
                  href="/login"
                  variant="bordered"
                  className="w-full border-border hover:border-secondary hover:text-secondary transition-all duration-200"
                  size="lg"
                  radius="lg"
                >
                  Entrar na conta
                </Button>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">
                      Seus dados estão seguros
                    </p>
                    <p className="text-xs text-foreground-secondary">
                      Utilizamos criptografia avançada para proteger suas
                      informações pessoais.
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
