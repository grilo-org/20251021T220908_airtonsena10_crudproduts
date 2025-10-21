import { Spinner } from "@heroui/react";

export function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner />
    </div>
  );
}