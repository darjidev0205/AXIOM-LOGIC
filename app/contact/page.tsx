"use client";

import Link from "next/link";
import TopNavBar from "@/components/navigation/TopNavBar";
import Footer from "@/components/navigation/Footer";
import { Mail, MessageSquare, Building2, ArrowRight } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#0F172A]">
      <TopNavBar />

      <main className="flex-grow">
        <div className="border-b border-[#E2E8F0] bg-white py-16">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8">
            <div className="max-w-3xl">
              <span className="text-[10px] font-mono font-semibold text-[#2563EB] tracking-widest uppercase mb-3 block">
                GET IN TOUCH
              </span>
              <h1 className="text-[32px] sm:text-[40px] font-semibold text-[#0F172A] tracking-tight mb-4">
                Speak directly with an automation architect.
              </h1>
              <p className="text-[16px] text-[#434655]">
                We don&apos;t use canned sales scripts. Discuss your data models, security boundary requirements, and ROI targets.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#eff4ff] text-[#2563EB] flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-[#737686] uppercase">Direct Email</div>
                    <div className="text-[14px] font-semibold text-[#0F172A]">architects@axiomlogic.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#eff4ff] text-[#2563EB] flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-[#737686] uppercase">Headquarters</div>
                    <div className="text-[14px] font-semibold text-[#0F172A]">San Francisco, CA &amp; New York, NY</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#eff4ff] border border-[#2563EB]/20">
                <h4 className="text-[14px] font-semibold text-[#0F172A] mb-1">
                  Want an immediate interactive review?
                </h4>
                <p className="text-[13px] text-[#434655] mb-4">
                  Schedule a 30-minute discovery session with a solutions engineer.
                </p>
                <Link
                  href="/book"
                  className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] px-4 py-2 rounded-lg text-[13px] font-medium transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>Book a 1:1 Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-xs">
              <h3 className="text-[18px] font-semibold text-[#0F172A] mb-6">Send Technical Inquiry</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you! An automation architect will reply within 4 business hours.");
                }}
                className="space-y-4 text-[13px]"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#0F172A] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#0F172A] mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#0F172A] mb-1">Company &amp; Stack</label>
                  <input
                    type="text"
                    placeholder="E.g. Shopify, PostgreSQL, Zendesk, Salesforce"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#0F172A] mb-1">Workflow Requirements</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your current bottleneck and expected automated outcome..."
                    className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2.5 rounded-lg font-medium transition-all shadow-xs"
                >
                  Send Message to Architecture Team
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
