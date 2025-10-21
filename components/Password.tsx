"use client";

import React, { useState, forwardRef } from "react";
import { Input } from "@heroui/react";
import { Eye, EyeOff, Lock } from "lucide-react";
import type { InputProps } from "@heroui/react";

type InputPasswordProps = Omit<InputProps, "type" | "endContent">;

const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
      <div className="space-y-1">
        <Input
          {...props}
          ref={ref}
          type={isVisible ? "text" : "password"}
          startContent={
            props.startContent || (
              <Lock className="w-4 h-4 text-foreground-secondary" />
            )
          }
          endContent={
            <button
              className="focus:outline-none p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
            >
              {isVisible ? (
                <EyeOff className="w-4 h-4 text-foreground-secondary hover:text-foreground transition-colors" />
              ) : (
                <Eye className="w-4 h-4 text-foreground-secondary hover:text-foreground transition-colors" />
              )}
            </button>
          }
          variant={props.variant || "bordered"}
          radius={props.radius || "lg"}
          classNames={{
            input: "text-sm",
            inputWrapper:
              props.classNames?.inputWrapper ||
              "border-border/50 hover:border-border focus-within:border-primary transition-all duration-200",
            ...props.classNames,
          }}
        />
      </div>
    );
  },
);

InputPassword.displayName = "InputPassword";

export default InputPassword;
