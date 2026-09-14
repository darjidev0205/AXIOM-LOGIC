import { Suspense } from "react";
import type { Metadata } from "next";
import ArchitectureIntakeForm from "./ArchitectureIntakeForm";

export const metadata: Metadata = {
  title: "Architecture Intake | AXIOM Logic",
  description: "Pre-meeting workflow architecture preparation for your upcoming AXIOM engineering review.",
};

export default function ArchitectureIntakePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
          <div className="text-center space-y-4 font-mono text-[13px] text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>INITIALIZING INTAKE PROTOCOL...</p>
          </div>
        </div>
      }
    >
      <ArchitectureIntakeForm />
    </Suspense>
  );
}
