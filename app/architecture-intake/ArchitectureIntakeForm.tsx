"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TopNavBar from "@/components/navigation/TopNavBar";
import Footer from "@/components/navigation/Footer";
import AxiomCornerCard from "@/components/ui/AxiomCornerCard";
import {
  submitArchitectureIntake,
  AxiomArchitectureIntakePayload,
} from "@/services/axiomPhase2";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Check,
  RotateCcw,
  Mail,
  AlertTriangle,
  User,
} from "lucide-react";

// ============================================================
// QUESTIONNAIRE OPTIONS DEFINITION (PER SPECIFICATION)
// ============================================================

const SYSTEMS_OPTIONS = [
  "CRM",
  "ERP",
  "Helpdesk",
  "Accounting",
  "Database",
  "Email",
  "Communication",
  "Project Management",
  "E-commerce",
  "Internal Tools",
  "Spreadsheets",
  "Other",
];

const BOTTLENECK_OPTIONS = [
  "Manual Data Entry",
  "Approvals",
  "Data Synchronization",
  "Customer Communication",
  "Reporting",
  "Invoicing",
  "Lead Management",
  "Order Processing",
  "Internal Operations",
  "Other",
];

const MANUAL_HOURS_OPTIONS = ["Less than 5", "5–10", "10–20", "20–40", "40+"];

const WEEKLY_VOLUME_OPTIONS = [
  "Less than 50",
  "50–200",
  "200–500",
  "500–1,000",
  "1,000+",
];

const ERROR_FREQUENCY_OPTIONS = [
  "Rarely",
  "Occasionally",
  "Monthly",
  "Weekly",
  "Daily",
];

const BUSINESS_IMPACT_OPTIONS = [
  "Save Employee Time",
  "Reduce Errors",
  "Increase Revenue",
  "Improve Customer Experience",
  "Improve Visibility",
  "Reduce Operational Cost",
  "Scale Operations",
  "Improve Compliance",
  "Other",
];

const AUTOMATION_TOOLS_OPTIONS = [
  "None",
  "Zapier",
  "Make",
  "n8n",
  "Power Automate",
  "Custom Automation",
  "AI Agents",
  "Other",
];

const SECURITY_OPTIONS = [
  "None",
  "SOC 2",
  "GDPR",
  "HIPAA",
  "PCI",
  "Internal Security Policy",
  "Data Residency",
  "Other",
];

type UIState =
  | "loading"
  | "invalid_token"
  | "already_completed"
  | "valid_form"
  | "successfully_submitted";

export default function ArchitectureIntakeForm() {
  const searchParams = useSearchParams();
  const rawToken = searchParams.get("token") || "";

  // Explicit UI status
  const [uiState, setUiState] = useState<UIState>("loading");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Active step (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Contact details (for verified payload submission)
  const [fullName, setFullName] = useState<string>("");
  const [workEmail, setWorkEmail] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");

  // Form State (12 Sections)
  const [systemsInvolved, setSystemsInvolved] = useState<string[]>([]);
  const [otherSystems, setOtherSystems] = useState<string>("");
  const [workflowDescription, setWorkflowDescription] = useState<string>("");
  const [primaryBottleneck, setPrimaryBottleneck] = useState<string>("");
  const [manualHoursPerWeek, setManualHoursPerWeek] = useState<string>("");
  const [weeklyVolume, setWeeklyVolume] = useState<string>("");
  const [errorFrequency, setErrorFrequency] = useState<string>("");
  const [repetitionScore, setRepetitionScore] = useState<number>(3);
  const [currentAutomationLevel, setCurrentAutomationLevel] = useState<number>(1);
  const [businessImpact, setBusinessImpact] = useState<string>("");
  const [existingAutomationTools, setExistingAutomationTools] = useState<string[]>([]);
  const [securityRequirements, setSecurityRequirements] = useState<string[]>([]);
  const [securityNotes, setSecurityNotes] = useState<string>("");
  const [successDefinition, setSuccessDefinition] = useState<string>("");

  // Initialize and validate token
  useEffect(() => {
    const trimmedToken = rawToken.trim();
    if (!trimmedToken) {
      setUiState("invalid_token");
      return;
    }

    // Try restoring draft from sessionStorage for this token
    try {
      const draftKey = `axiom_intake_draft_${trimmedToken}`;
      const saved = sessionStorage.getItem(draftKey);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.fullName) setFullName(d.fullName);
        if (d.workEmail) setWorkEmail(d.workEmail);
        if (d.companyName) setCompanyName(d.companyName);
        if (d.systemsInvolved) setSystemsInvolved(d.systemsInvolved);
        if (d.otherSystems) setOtherSystems(d.otherSystems);
        if (d.workflowDescription) setWorkflowDescription(d.workflowDescription);
        if (d.primaryBottleneck) setPrimaryBottleneck(d.primaryBottleneck);
        if (d.manualHoursPerWeek) setManualHoursPerWeek(d.manualHoursPerWeek);
        if (d.weeklyVolume) setWeeklyVolume(d.weeklyVolume);
        if (d.errorFrequency) setErrorFrequency(d.errorFrequency);
        if (typeof d.repetitionScore === "number") setRepetitionScore(d.repetitionScore);
        if (typeof d.currentAutomationLevel === "number") setCurrentAutomationLevel(d.currentAutomationLevel);
        if (d.businessImpact) setBusinessImpact(d.businessImpact);
        if (d.existingAutomationTools) setExistingAutomationTools(d.existingAutomationTools);
        if (d.securityRequirements) setSecurityRequirements(d.securityRequirements);
        if (d.securityNotes) setSecurityNotes(d.securityNotes);
        if (d.successDefinition) setSuccessDefinition(d.successDefinition);
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }

    setUiState("valid_form");
  }, [rawToken]);

  // Persist draft to sessionStorage whenever answers change
  useEffect(() => {
    if (uiState !== "valid_form" || !rawToken.trim()) return;

    try {
      const draftKey = `axiom_intake_draft_${rawToken.trim()}`;
      const draft = {
        fullName,
        workEmail,
        companyName,
        systemsInvolved,
        otherSystems,
        workflowDescription,
        primaryBottleneck,
        manualHoursPerWeek,
        weeklyVolume,
        errorFrequency,
        repetitionScore,
        currentAutomationLevel,
        businessImpact,
        existingAutomationTools,
        securityRequirements,
        securityNotes,
        successDefinition,
      };
      sessionStorage.setItem(draftKey, JSON.stringify(draft));
    } catch {
      // Ignore
    }
  }, [
    rawToken,
    uiState,
    fullName,
    workEmail,
    companyName,
    systemsInvolved,
    otherSystems,
    workflowDescription,
    primaryBottleneck,
    manualHoursPerWeek,
    weeklyVolume,
    errorFrequency,
    repetitionScore,
    currentAutomationLevel,
    businessImpact,
    existingAutomationTools,
    securityRequirements,
    securityNotes,
    successDefinition,
  ]);

  // Toggle multi-select helper
  const toggleSelection = (
    list: string[],
    item: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (item === "None") {
      setList(["None"]);
      return;
    }
    const filtered = list.filter((i) => i !== "None");
    if (filtered.includes(item)) {
      setList(filtered.filter((i) => i !== item));
    } else {
      setList([...filtered, item]);
    }
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (systemsInvolved.length === 0) {
        errors.systemsInvolved = "Please select at least one system involved.";
      }
      if (systemsInvolved.includes("Other") && !otherSystems.trim()) {
        errors.otherSystems = "Please specify which other systems are involved.";
      }
      if (!workflowDescription.trim() || workflowDescription.trim().length < 10) {
        errors.workflowDescription =
          "Please describe your current process (minimum 10 characters).";
      }
      if (!primaryBottleneck) {
        errors.primaryBottleneck = "Please select where the biggest bottleneck occurs.";
      }
    }

    if (step === 2) {
      if (!manualHoursPerWeek) {
        errors.manualHoursPerWeek = "Please select approximately how many hours per week are spent.";
      }
      if (!weeklyVolume) {
        errors.weeklyVolume = "Please select approximately how many transactions are processed.";
      }
      if (!errorFrequency) {
        errors.errorFrequency = "Please select how often errors or missed steps occur.";
      }
    }

    if (step === 3) {
      if (!repetitionScore) {
        errors.repetitionScore = "Please rate how repetitive this workflow is.";
      }
      if (!currentAutomationLevel) {
        errors.currentAutomationLevel = "Please rate the current automation level.";
      }
      if (existingAutomationTools.length === 0) {
        errors.existingAutomationTools = "Please select any tools currently used (or 'None').";
      }
    }

    if (step === 4) {
      if (!businessImpact) {
        errors.businessImpact = "Please select the primary business impact.";
      }
      if (securityRequirements.length === 0) {
        errors.securityRequirements = "Please select applicable compliance requirements (or 'None').";
      }
      if (!successDefinition.trim() || successDefinition.trim().length < 5) {
        errors.successDefinition = "Please briefly define what success looks like.";
      }
      if (!fullName.trim()) {
        errors.fullName = "Please provide your full name.";
      }
      if (!workEmail.trim() || !workEmail.includes("@")) {
        errors.workEmail = "Please provide a valid work email.";
      }
      if (!companyName.trim()) {
        errors.companyName = "Please provide your organization name.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setValidationErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setValidationErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    const token = rawToken.trim();

    const payload: AxiomArchitectureIntakePayload = {
      axiom_lead_id: token, // Canonical token used as authoritative lead reference
      questionnaire_token: token,
      full_name: fullName.trim(),
      work_email: workEmail.trim(),
      company_name: companyName.trim(),
      systems_involved: systemsInvolved,
      other_systems: systemsInvolved.includes("Other") ? otherSystems.trim() : "",
      workflow_description: workflowDescription.trim(),
      primary_bottleneck: primaryBottleneck,
      manual_hours_per_week: manualHoursPerWeek,
      weekly_volume: weeklyVolume,
      error_frequency: errorFrequency,
      repetition_score: repetitionScore,
      current_automation_level: currentAutomationLevel,
      business_impact: businessImpact,
      existing_automation_tools: existingAutomationTools,
      security_requirements: securityRequirements,
      security_notes: securityNotes.trim(),
      success_definition: successDefinition.trim(),
    };

    const result = await submitArchitectureIntake(payload);

    setIsSubmitting(false);

    if (result.resultType === "success") {
      setUiState("successfully_submitted");
      // Clear draft on success
      try {
        sessionStorage.removeItem(`axiom_intake_draft_${token}`);
      } catch {
        // Ignore
      }
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    if (result.resultType === "invalid_token") {
      setUiState("invalid_token");
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    if (result.resultType === "already_completed") {
      setUiState("already_completed");
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    // Temporary failure or validation failure:
    // Retain all answers, do NOT reload or wipe state. Display clear error with retry option.
    setSubmissionError(result.message);
    window.scrollTo({ top: 220, behavior: "smooth" });
  };

  // ============================================================
  // RENDER: EXPLICIT UI STATES
  // ============================================================

  // 1. Loading State
  if (uiState === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F172A] text-white">
        <TopNavBar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-[12px] font-mono text-slate-400 uppercase tracking-wider">
              VERIFYING ARCHITECTURE INTAKE SESSION...
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Expired / Invalid Token State
  if (uiState === "invalid_token") {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
        <TopNavBar />
        <main className="flex-grow py-16 sm:py-24">
          <div className="axiom-container max-w-xl mx-auto">
            <AxiomCornerCard
              corner="bottom-right"
              color="amber"
              className="p-8 sm:p-12 text-center bg-white border-slate-200 shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-6 border border-amber-200">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="text-[11px] font-mono text-amber-600 font-bold uppercase tracking-widest mb-2">
                INTAKE PROTOCOL // ACCESS REQUIRED
              </div>

              <h2 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight mb-3">
                Intake Link Not Verified
              </h2>

              <p className="text-[15px] text-slate-600 leading-relaxed mb-6">
                We could not verify your architecture intake link. Each intake is cryptographically tied to a confirmed architecture session.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-[13px] text-slate-700 space-y-2 mb-8 font-sans">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>
                    Check your email inbox for the personalized <strong>Pre-Meeting Architecture Intake</strong> link dispatched after your booking was confirmed.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Your booked architecture session remains active and confirmed.</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/book" className="btn-axiom-primary px-6 py-3 text-[14px]">
                  View Booking Center
                </Link>
                <Link href="/" className="btn-axiom-secondary px-6 py-3 text-[14px]">
                  Return to Home
                </Link>
              </div>
            </AxiomCornerCard>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 3. Already Completed State
  if (uiState === "already_completed") {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
        <TopNavBar />
        <main className="flex-grow py-16 sm:py-24">
          <div className="axiom-container max-w-xl mx-auto">
            <AxiomCornerCard
              corner="bottom-right"
              color="emerald"
              className="p-8 sm:p-12 text-center bg-white border-slate-200 shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-[11px] font-mono text-emerald-600 font-bold uppercase tracking-widest mb-2">
                STATUS // INTAKE RECORDED
              </div>

              <h2 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight mb-3">
                Intake Already Completed
              </h2>

              <p className="text-[15px] text-slate-600 leading-relaxed mb-6">
                Your workflow details have already been submitted and routed to the AXIOM architecture team for your upcoming review.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-[13px] text-slate-700 space-y-2 mb-8 font-mono">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Workflow topology mapped</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Systems review under preparation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Your session remains confirmed</span>
                </div>
              </div>

              <Link href="/live-demo" className="btn-axiom-primary px-6 py-3 text-[14px]">
                Explore Architecture Simulator
              </Link>
            </AxiomCornerCard>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 4. Successfully Submitted State
  if (uiState === "successfully_submitted") {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0F172A]">
        <TopNavBar />
        <main className="flex-grow py-16 sm:py-24">
          <div className="axiom-container max-w-2xl mx-auto">
            <AxiomCornerCard
              corner="bottom-right"
              color="emerald"
              className="p-8 sm:p-14 text-center border-slate-200 shadow-2xl bg-white"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border border-emerald-200/80 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-[11px] font-mono text-emerald-600 font-bold uppercase tracking-widest mb-2">
                AXIOM LOGIC // PROTOCOL ACKNOWLEDGED
              </div>

              <h2 className="text-[32px] sm:text-[38px] font-bold text-[#0F172A] tracking-tight mb-3">
                Architecture Intake Received
              </h2>

              <p className="text-[17px] text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed">
                Thank you. We&apos;ve received your workflow information. Our architecture team will review your responses before your session so we can make the conversation more focused and useful.
              </p>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto mb-8 space-y-3.5 font-mono text-[13px]">
                <div className="flex items-center gap-3 text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>Workflow information received</span>
                </div>
                <div className="flex items-center gap-3 text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>Architecture team preparation</span>
                </div>
                <div className="flex items-center gap-3 text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>Your session remains confirmed</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/live-demo" className="btn-axiom-primary px-6 py-3 text-[14px] gap-2">
                  <span>Explore Live Architecture Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/" className="btn-axiom-secondary px-5 py-3 text-[14px]">
                  Return to Home
                </Link>
              </div>
            </AxiomCornerCard>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 5. Valid Form State (Includes Submitting & Temporary Failure Recovery)
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0F172A] selection:bg-blue-600 selection:text-white">
      <TopNavBar />

      <main className="flex-grow">
        {/* ================= EDITORIAL HEADER ================= */}
        <section className="relative border-b border-slate-200/80 bg-white pt-12 pb-10 overflow-hidden">
          <div className="absolute inset-0 tech-grid-pattern pointer-events-none opacity-40" />
          <div className="axiom-container relative z-10">
            {/* Top Telemetry Strip */}
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-widest pb-3 mb-6 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <span className="crosshair-mark pl-2 text-[#2563EB] font-bold">
                  + AXIOM LOGIC // ARCHITECTURE INTAKE
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                  Takes approx. 2–3 minutes
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-600 font-semibold">SECURITY: DETERMINISTIC PRIVACY</span>
                <span className="text-slate-300">•</span>
                <span className="text-[#2563EB] font-semibold">ENGINEERING LEVEL 3 AUDIT</span>
              </div>
            </div>

            {/* Headline */}
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-[11px] font-mono tracking-wider uppercase font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PRE-MEETING INTELLIGENCE AUDIT</span>
              </div>

              <h1 className="font-display-hero font-bold text-[#0F172A] tracking-tight leading-[1.08] text-[34px] sm:text-[44px]">
                Architecture Intake
              </h1>

              <p className="text-[17px] sm:text-[19px] text-slate-600 leading-relaxed font-normal">
                Help us understand your current workflow before your Architecture Review.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between text-[12px] font-mono mb-2">
                <span className="text-[#2563EB] font-bold">
                  STEP {currentStep} OF 4:{" "}
                  {currentStep === 1 && "SYSTEMS & WORKFLOW TOPOLOGY"}
                  {currentStep === 2 && "EFFORT, VOLUME & FREQUENCY"}
                  {currentStep === 3 && "REPETITION & AUTOMATION BASELINE"}
                  {currentStep === 4 && "STRATEGIC IMPACT & REVIEW ALIGNMENT"}
                </span>
                <span className="text-slate-400">{Math.round((currentStep / 4) * 100)}% COMPLETE</span>
              </div>

              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981] transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= FORM BODY ================= */}
        <section className="axiom-container py-10 sm:py-14 max-w-3xl mx-auto">
          {/* Temporary Server / Network Error Banner (Preserves User Data) */}
          {submissionError && (
            <div className="mb-8 p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 animate-in fade-in space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[15px]">Submission Incomplete</h4>
                  <p className="text-[14px] text-amber-800 mt-1 leading-relaxed">
                    We couldn&apos;t submit your intake right now. Your answers are still here. Please try again.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold text-[13px] hover:bg-amber-700 transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <AxiomCornerCard
              corner="bottom-right"
              color="blue"
              className="p-6 sm:p-10 bg-white border-slate-200 shadow-xl"
            >
              {/* ================= STEP 1: SYSTEMS & WORKFLOW ================= */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Section 1: Current Systems */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[15px] font-semibold text-[#0F172A]">
                        What systems are involved in this workflow?{" "}
                        <span className="text-[#2563EB]">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">MULTI-SELECT</span>
                    </div>
                    <p className="text-[13px] text-slate-500 mb-4">
                      Select all platforms that store or process information during this process.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {SYSTEMS_OPTIONS.map((sys) => {
                        const isSelected = systemsInvolved.includes(sys);
                        return (
                          <button
                            key={sys}
                            type="button"
                            onClick={() =>
                              toggleSelection(systemsInvolved, sys, setSystemsInvolved)
                            }
                            className={`px-3.5 py-3 rounded-xl border text-[13.5px] font-medium text-left transition flex items-center justify-between ${
                              isSelected
                                ? "bg-blue-50/80 border-[#2563EB] text-[#2563EB] font-semibold shadow-xs"
                                : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                            }`}
                          >
                            <span>{sys}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#2563EB]" />}
                          </button>
                        );
                      })}
                    </div>

                    {systemsInvolved.includes("Other") && (
                      <div className="mt-3.5 animate-in fade-in">
                        <label className="block text-[13px] font-medium text-slate-700 mb-1">
                          Which other systems? <span className="text-[#2563EB]">*</span>
                        </label>
                        <input
                          type="text"
                          value={otherSystems}
                          onChange={(e) => setOtherSystems(e.target.value)}
                          placeholder="e.g., Custom SQL database, legacy mainframe, proprietary desktop app"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                        {validationErrors.otherSystems && (
                          <p className="text-[12px] text-red-600 mt-1">{validationErrors.otherSystems}</p>
                        )}
                      </div>
                    )}

                    {validationErrors.systemsInvolved && (
                      <p className="text-[12px] text-red-600 mt-2">{validationErrors.systemsInvolved}</p>
                    )}
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Section 2: Current Workflow */}
                  <div>
                    <label className="block text-[15px] font-semibold text-[#0F172A] mb-1.5">
                      How does this process work today? <span className="text-[#2563EB]">*</span>
                    </label>
                    <p className="text-[13px] text-slate-500 mb-3">
                      Briefly describe what happens from the beginning of the process to the end.
                    </p>
                    <textarea
                      rows={4}
                      value={workflowDescription}
                      onChange={(e) => setWorkflowDescription(e.target.value)}
                      placeholder="Briefly describe what happens from the beginning of the process to the end."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100 leading-relaxed"
                    />
                    {validationErrors.workflowDescription && (
                      <p className="text-[12px] text-red-600 mt-1">
                        {validationErrors.workflowDescription}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Section 3: Biggest Bottleneck */}
                  <div>
                    <label className="block text-[15px] font-semibold text-[#0F172A] mb-1.5">
                      Where does the biggest bottleneck occur?{" "}
                      <span className="text-[#2563EB]">*</span>
                    </label>
                    <p className="text-[13px] text-slate-500 mb-4">
                      Select the single step that introduces the greatest friction or delay.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {BOTTLENECK_OPTIONS.map((item) => {
                        const isSelected = primaryBottleneck === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setPrimaryBottleneck(item)}
                            className={`px-4 py-3 rounded-xl border text-[13.5px] font-medium text-left transition flex items-center justify-between ${
                              isSelected
                                ? "bg-blue-50/80 border-[#2563EB] text-[#2563EB] font-semibold shadow-xs"
                                : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{item}</span>
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? "border-[#2563EB] bg-[#2563EB]" : "border-slate-300"
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {validationErrors.primaryBottleneck && (
                      <p className="text-[12px] text-red-600 mt-2">
                        {validationErrors.primaryBottleneck}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ================= STEP 2: EFFORT & VOLUME ================= */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Section 4: Manual Work */}
                  <div>
                    <label className="block text-[15px] font-semibold text-[#0F172A] mb-1.5">
                      Approximately how many hours per week are spent manually handling this process?{" "}
                      <span className="text-[#2563EB]">*</span>
                    </label>
                    <p className="text-[13px] text-slate-500 mb-4">
                      Estimated cumulative team effort across all involved personnel.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {MANUAL_HOURS_OPTIONS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setManualHoursPerWeek(item)}
                          className={`px-3 py-3 rounded-xl border text-center transition font-semibold text-[14px] ${
                            manualHoursPerWeek === item
                              ? "bg-[#0F172A] text-white border-[#0F172A] shadow-md"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    {validationErrors.manualHoursPerWeek && (
                      <p className="text-[12px] text-red-600 mt-2">
                        {validationErrors.manualHoursPerWeek}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Section 5: Workflow Volume */}
                  <div>
                    <label className="block text-[15px] font-semibold text-[#0F172A] mb-1.5">
                      Approximately how many requests or transactions does this workflow handle per week?{" "}
                      <span className="text-[#2563EB]">*</span>
                    </label>
                    <p className="text-[13px] text-slate-500 mb-4">
                      Weekly order count, support tickets, records synchronized, or documents processed.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {WEEKLY_VOLUME_OPTIONS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setWeeklyVolume(item)}
                          className={`px-3 py-3 rounded-xl border text-center transition font-semibold text-[13.5px] ${
                            weeklyVolume === item
                              ? "bg-[#0F172A] text-white border-[#0F172A] shadow-md"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    {validationErrors.weeklyVolume && (
                      <p className="text-[12px] text-red-600 mt-2">{validationErrors.weeklyVolume}</p>
                    )}
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Section 6: Error Frequency */}
                  <div>
                    <label className="block text-[15px] font-semibold text-[#0F172A] mb-1.5">
                      How often do manual errors or missed steps occur?{" "}
                      <span className="text-[#2563EB]">*</span>
                    </label>
                    <p className="text-[13px] text-slate-500 mb-4">
                      Data mismatches, missed follow-ups, misrouted requests, or exceptions.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {ERROR_FREQUENCY_OPTIONS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setErrorFrequency(item)}
                          className={`px-3 py-3 rounded-xl border text-center transition font-semibold text-[14px] ${
                            errorFrequency === item
                              ? "bg-[#2563EB] text-white border-[#2563EB] shadow-md"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    {validationErrors.errorFrequency && (
                      <p className="text-[12px] text-red-600 mt-2">{validationErrors.errorFrequency}</p>
                    )}
                  </div>
                </div>
              )}

              {/* ================= STEP 3: REPETITION & TOOLS ================= */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Section 7: Repetition (1-5 Visual Scale) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[15px] font-semibold text-[#0F172A]">
                        How repetitive is this workflow? <span className="text-[#2563EB]">*</span>
                      </label>
                      <span className="text-[12px] font-mono font-bold text-[#2563EB]">
                        {repetitionScore} / 5
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-500 mb-4">
                      1 = Not very repetitive &bull; 5 = Extremely repetitive (high candidate for deterministic automation)
                    </p>

                    <div className="grid grid-cols-5 gap-2.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setRepetitionScore(val)}
                          className={`py-4 rounded-xl border text-center transition ${
                            repetitionScore === val
                              ? "bg-[#0F172A] text-white border-[#0F172A] shadow-md"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="text-[20px] font-bold">{val}</div>
                          <div className="text-[10px] font-mono mt-0.5 text-slate-400">
                            {val === 1 && "LOW"}
                            {val === 3 && "MODERATE"}
                            {val === 5 && "EXTREME"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Section 8: Current Automation (1-5 Visual Scale) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[15px] font-semibold text-[#0F172A]">
                        How automated is this workflow today? <span className="text-[#2563EB]">*</span>
                      </label>
                      <span className="text-[12px] font-mono font-bold text-emerald-600">
                        {currentAutomationLevel} / 5
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-500 mb-4">
                      1 = Completely manual &bull; 5 = Highly automated
                    </p>

                    <div className="grid grid-cols-5 gap-2.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setCurrentAutomationLevel(val)}
                          className={`py-4 rounded-xl border text-center transition ${
                            currentAutomationLevel === val
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="text-[20px] font-bold">{val}</div>
                          <div className="text-[10px] font-mono mt-0.5 text-slate-400">
                            {val === 1 && "MANUAL"}
                            {val === 3 && "PARTIAL"}
                            {val === 5 && "AUTOMATED"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Section 10: Current Automation Tools */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[15px] font-semibold text-[#0F172A]">
                        Are you currently using automation or AI tools?{" "}
                        <span className="text-[#2563EB]">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">MULTI-SELECT</span>
                    </div>
                    <p className="text-[13px] text-slate-500 mb-4">
                      Select any platforms currently active in your organization.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {AUTOMATION_TOOLS_OPTIONS.map((tool) => {
                        const isSelected = existingAutomationTools.includes(tool);
                        return (
                          <button
                            key={tool}
                            type="button"
                            onClick={() =>
                              toggleSelection(existingAutomationTools, tool, setExistingAutomationTools)
                            }
                            className={`px-3.5 py-3 rounded-xl border text-[13.5px] font-medium text-left transition flex items-center justify-between ${
                              isSelected
                                ? "bg-blue-50/80 border-[#2563EB] text-[#2563EB] font-semibold shadow-xs"
                                : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{tool}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#2563EB]" />}
                          </button>
                        );
                      })}
                    </div>
                    {validationErrors.existingAutomationTools && (
                      <p className="text-[12px] text-red-600 mt-2">
                        {validationErrors.existingAutomationTools}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ================= STEP 4: IMPACT & ALIGNMENT ================= */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Section 9: Business Impact */}
                  <div>
                    <label className="block text-[15px] font-semibold text-[#0F172A] mb-1.5">
                      If this bottleneck were solved, what would have the biggest impact?{" "}
                      <span className="text-[#2563EB]">*</span>
                    </label>
                    <p className="text-[13px] text-slate-500 mb-4">
                      Primary organizational objective driving this automation initiative.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {BUSINESS_IMPACT_OPTIONS.map((item) => {
                        const isSelected = businessImpact === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setBusinessImpact(item)}
                            className={`px-3.5 py-3 rounded-xl border text-[13px] font-medium text-left transition flex items-center justify-between ${
                              isSelected
                                ? "bg-blue-50/80 border-[#2563EB] text-[#2563EB] font-semibold shadow-xs"
                                : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{item}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#2563EB]" />}
                          </button>
                        );
                      })}
                    </div>
                    {validationErrors.businessImpact && (
                      <p className="text-[12px] text-red-600 mt-2">{validationErrors.businessImpact}</p>
                    )}
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Section 11: Security / Compliance */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[15px] font-semibold text-[#0F172A]">
                        Are there security, compliance or data-isolation requirements we should consider?{" "}
                        <span className="text-[#2563EB]">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">MULTI-SELECT</span>
                    </div>
                    <p className="text-[13px] text-slate-500 mb-4">
                      Security standards or sovereign isolation constraints governing your infrastructure.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                      {SECURITY_OPTIONS.map((sec) => {
                        const isSelected = securityRequirements.includes(sec);
                        return (
                          <button
                            key={sec}
                            type="button"
                            onClick={() =>
                              toggleSelection(securityRequirements, sec, setSecurityRequirements)
                            }
                            className={`px-3 py-2.5 rounded-xl border text-[13px] font-medium text-left transition flex items-center justify-between ${
                              isSelected
                                ? "bg-emerald-50/80 border-emerald-600 text-emerald-700 font-semibold"
                                : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{sec}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>

                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                      Anything else our architecture team should know? (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={securityNotes}
                      onChange={(e) => setSecurityNotes(e.target.value)}
                      placeholder="e.g., On-premise network isolation, self-hosted LLM preferences, specific residency region..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[13.5px] text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                    {validationErrors.securityRequirements && (
                      <p className="text-[12px] text-red-600 mt-1">
                        {validationErrors.securityRequirements}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Section 12: Success Definition */}
                  <div>
                    <label className="block text-[15px] font-semibold text-[#0F172A] mb-1.5">
                      What would success look like after improving this workflow?{" "}
                      <span className="text-[#2563EB]">*</span>
                    </label>
                    <p className="text-[13px] text-slate-500 mb-3">
                      Example: Reduce manual processing, respond faster to customers, eliminate duplicate data entry, etc.
                    </p>
                    <textarea
                      rows={3}
                      value={successDefinition}
                      onChange={(e) => setSuccessDefinition(e.target.value)}
                      placeholder="Example: Reduce manual processing, respond faster to customers, eliminate duplicate data entry, etc."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100 leading-relaxed"
                    />
                    {validationErrors.successDefinition && (
                      <p className="text-[12px] text-red-600 mt-1">
                        {validationErrors.successDefinition}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Customer Identity Verification (Ensures n8n payload has verified contact data) */}
                  <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                      <User className="w-4 h-4 text-[#2563EB]" />
                      <span className="text-[12px] font-mono font-semibold text-slate-700 uppercase tracking-wider">
                        SESSION RECIPIENT VERIFICATION
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[12.5px] font-medium text-slate-700 mb-1">
                          Full Name <span className="text-[#2563EB]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-[13.5px] text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                        />
                        {validationErrors.fullName && (
                          <p className="text-[11px] text-red-600 mt-1">{validationErrors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[12.5px] font-medium text-slate-700 mb-1">
                          Work Email <span className="text-[#2563EB]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                          placeholder="alex@enterprise.com"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-[13.5px] text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                        />
                        {validationErrors.workEmail && (
                          <p className="text-[11px] text-red-600 mt-1">{validationErrors.workEmail}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[12.5px] font-medium text-slate-700 mb-1">
                          Company Name <span className="text-[#2563EB]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Acme Global Inc"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-[13.5px] text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                        />
                        {validationErrors.companyName && (
                          <p className="text-[11px] text-red-600 mt-1">{validationErrors.companyName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= NAVIGATION & ACTIONS ================= */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="btn-axiom-secondary px-5 py-3 text-[14px] flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-axiom-primary px-7 py-3 text-[14px] flex items-center gap-2 font-semibold"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-axiom-primary px-8 py-3.5 text-[15px] flex items-center gap-2.5 font-semibold shadow-lg hover:shadow-xl disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Preparing your intake...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Architecture Intake</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </AxiomCornerCard>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
