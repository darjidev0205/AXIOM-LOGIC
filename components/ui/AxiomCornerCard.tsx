import React from "react";

export type CornerPosition = "bottom-right" | "top-left" | "bottom-left" | "top-right";
export type CornerColor = "blue" | "emerald" | "cyan" | "amber" | "red";

interface AxiomCornerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  corner?: CornerPosition;
  color?: CornerColor;
  isActive?: boolean;
}

const cornerClassMap: Record<CornerPosition, string> = {
  "bottom-right": "corner-br",
  "top-left": "corner-tl",
  "bottom-left": "corner-bl",
  "top-right": "corner-tr",
};

const colorClassMap: Record<CornerColor, string> = {
  blue: "accent-blue",
  emerald: "accent-emerald",
  cyan: "accent-cyan",
  amber: "accent-amber",
  red: "accent-red",
};

export function AxiomCornerCard({
  children,
  className = "",
  corner = "bottom-right",
  color = "blue",
  isActive = false,
  ...props
}: AxiomCornerCardProps) {
  const cornerClass = cornerClassMap[corner];
  const colorClass = colorClassMap[color];

  return (
    <div
      className={`axiom-corner-card ${isActive ? "axiom-card-active border-blue-500/50 shadow-md" : ""} ${className}`}
      {...props}
    >
      {/* Signature AXIOM Quarter-Circle Corner Accent */}
      <div
        className={`axiom-corner-accent ${cornerClass} ${colorClass}`}
        aria-hidden="true"
      />

      {/* Card Content - elevated above corner accent */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

export default AxiomCornerCard;
