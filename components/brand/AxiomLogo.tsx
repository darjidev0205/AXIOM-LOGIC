import React from "react";
import Image from "next/image";
import AxiomSymbol from "./AxiomSymbol";

interface AxiomLogoProps {
  className?: string;
  variant?: "compact" | "full" | "symbol";
  theme?: "light" | "dark";
  height?: number;
  priority?: boolean;
}

export default function AxiomLogo({
  className = "",
  variant = "compact",
  theme = "light",
  height = 36,
  priority = false,
}: AxiomLogoProps) {
  const isDark = theme === "dark";

  if (variant === "symbol") {
    return (
      <AxiomSymbol
        size={height}
        theme={theme}
        className={className}
      />
    );
  }

  // Width is proportional to the original aspect ratio
  // Compact logo original aspect ratio: 645 x 161 (~4.0)
  // Full logo original aspect ratio: 646 x 197 (~3.28)
  const width = variant === "full" ? Math.round(height * 3.28) : Math.round(height * 4.0);

  if (isDark) {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {/* Crisp vector symbol + stylized wordmark for razor-sharp dark mode display */}
        <AxiomSymbol size={height} theme="dark" />
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center tracking-[0.06em] text-white font-bold text-[18px]">
            <span>AXIOM</span>
          </div>
          <div className="text-[13px] tracking-[0.18em] text-slate-300 font-light mt-0.5">
            Logic
          </div>
          {variant === "full" && (
            <div className="text-[8px] font-mono tracking-[0.24em] text-emerald-400 mt-1 uppercase flex items-center gap-1.5">
              <span>AUTOMATE</span>
              <span className="text-blue-400">/</span>
              <span>INTEGRATE</span>
              <span className="text-blue-400">/</span>
              <span>OPTIMIZE</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Light theme: Use the official high-resolution logo image directly extracted from brand master
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src={variant === "full" ? "/axiom-logo.png" : "/axiom-logo-compact.png"}
        alt="AXIOM Logic — AI Automation Infrastructure"
        width={width}
        height={height}
        priority={priority}
        className="object-contain max-h-full w-auto"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}
