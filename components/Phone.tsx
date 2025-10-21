"use client";

import React from "react";
import { Input } from "@heroui/react";
import {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";

interface PhoneInputProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;

  watch: UseFormWatch<T>;

  errors?: FieldErrors<T>;
  countryName?: string;
  dddName?: string;
  numberName?: string;
}

export function PhoneInput<T extends FieldValues>({
  setValue,
  watch,
  errors,
  countryName = "phone.country",
  dddName = "phone.ddd",
  numberName = "phone.number",
}: PhoneInputProps<T>) {
  // Função para formatar apenas números
  const formatOnlyNumbers = (value: string) => {
    return value.replace(/\D/g, "");
  };

  // Handler para código do país (máximo 3 dígitos)
  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatOnlyNumbers(e.target.value).slice(0, 3);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(countryName as Path<T>, formatted as any);
  };

  // Handler para DDD (máximo 2 dígitos)
  const handleDDDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatOnlyNumbers(e.target.value).slice(0, 2);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(dddName as Path<T>, formatted as any);
  };

  // Handler para número de telefone (máximo 9 dígitos)
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatOnlyNumbers(e.target.value).slice(0, 9);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(numberName as Path<T>, formatted as any);
  };

  // Helper para acessar erros aninhados
  const getNestedError = (path: string) => {
    const keys = path.split(".");

    let current = errors;
    for (const key of keys) {
      if (current?.[key]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        current = current[key] as any;
      } else {
        return undefined;
      }
    }
    return current;
  };

  const countryError = getNestedError(countryName);
  const dddError = getNestedError(dddName);
  const numberError = getNestedError(numberName);

  return (
    <div className="grid grid-cols-3 gap-2">
      <Input
        label="País"
        placeholder="55"
        value={watch(countryName as Path<T>) || ""}
        onChange={handleCountryChange}
        isInvalid={!!countryError}
        errorMessage={countryError?.message ? String(countryError.message) : undefined}
        description="Código do país"
        inputMode="numeric"
      />
      <Input
        label="DDD"
        placeholder="ex:75"
        value={watch(dddName as Path<T>) || ""}
        onChange={handleDDDChange}
        isInvalid={!!dddError}
        errorMessage={dddError?.message ? String(dddError.message) : undefined}
        description="2 dígitos"
        inputMode="numeric"
      />
      <Input
        label="Número"
        placeholder="ex:75999855695"
        value={watch(numberName as Path<T>) || ""}
        onChange={handlePhoneNumberChange}
        isInvalid={!!numberError}
        errorMessage={numberError?.message ? String(numberError.message) : undefined}
        description="8 ou 9 dígitos"
        inputMode="numeric"
      />
    </div>
  );
}
