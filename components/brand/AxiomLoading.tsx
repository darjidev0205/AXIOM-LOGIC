import React from "react";
import AxiomSymbol from "./AxiomSymbol";

interface AxiomLoadingProps {
  size?: number;
  label?: string;
  theme?: "light" | "dark";
}

export default function AxiomLoading({
  size = 40,
  label = "Connecting to AXIOM Logic Runtime...",
  theme = "light",
}: AxiomLoadingProps) {
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div className="relative">
        <AxiomSymbol size={size} theme={theme} animated />
        <div
          className={`absolute -inset-2 rounded-full border border-dashed animate-spin duration-1000 ${
            isDark ? "border-blue-500/40" : "border-blue-600/30"
          }`}
        />
      </div>
      {label && (
        <span
          className={`text-[12px] font-mono tracking-wider uppercase ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
