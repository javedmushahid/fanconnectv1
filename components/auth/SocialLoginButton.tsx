"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface SocialLoginButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

export function SocialLoginButton({
  label,
  icon,
  onClick,
}: SocialLoginButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={onClick}
      className="
        w-full h-11
        flex items-center
        px-4
        rounded-lg
        transition
        hover:bg-muted/60
      "
    >
      {/* Fixed-width icon slot */}
      <span className="w-6 flex justify-center items-center">{icon}</span>

      {/* Centered label */}
      <span className="flex-1 text-center font-medium">{label}</span>

      {/* Right spacer (balances icon width) */}
      <span className="w-6" />
    </Button>
  );
}
