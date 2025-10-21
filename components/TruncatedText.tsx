"use client";

import React from "react";
import { Tooltip } from "@heroui/react";

interface TruncatedTextProps {
  text: string | number | null | undefined;
  className?: string;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";
}

export function TruncatedText({ text, className = "", placement = "bottom" }: TruncatedTextProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isTruncated, setIsTruncated] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    };
    check();
    // Recalcula em resize
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text]);

  const content = (
    <div ref={ref} className={`truncate ${className}`}>
      {text ?? ""}
    </div>
  );

  if (!isTruncated) return content;

  return (
    <Tooltip content={String(text ?? "")} placement={placement}>
      {content}
    </Tooltip>
  );
}


