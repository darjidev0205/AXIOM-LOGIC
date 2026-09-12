"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  Loader2,
  Wrench,
  ChevronDown,
  ArrowRight,
  Bot,
  User,
} from "lucide-react";
import Link from "next/link";
import AxiomSymbol from "@/components/brand/AxiomSymbol";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCall?: {
    toolName: string;
    status: string;
  } | null;
  timestamp: string;
}

const QUICK_ACTIONS = [
  "Explore automation",
  "Analyze my workflow",
  "Book a 1:1",
  "Try a demo",
];

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi. I can help you understand how Axiom Logic can automate your workflow.",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    // Handle quick navigations if selected
    if (textToSend === "Book a 1:1") {
      window.location.href = "/book";
      return;
    }
    if (textToSend === "Try a demo") {
      window.location.href = "/live-demo";
      return;
    }
    if (textToSend === "Explore automation") {
      window.location.href = "/solutions";
      return;
    }

    const userMessageId = `user-${messages.length + 1}`;
    const newMessages: Message[] = [
      ...messages,
      {
        id: userMessageId,
        role: "user",
        content: textToSend,
        timestamp: "Just now",
      },
    ];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: textToSend,
          conversationId: conversationId || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.messageId || `asst-${prev.length + 1}`,
          role: "assistant",
          content: data.reply || "I analyzed your workflow request with Axiom autonomous reasoning.",
          toolCall: data.toolCall
            ? {
                toolName: data.toolCall.toolName || "Axiom Tool Engine",
                status: data.toolCall.status || "SUCCESS",
              }
            : null,
          timestamp: "Just now",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${prev.length + 1}`,
          role: "assistant",
          content:
            "Axiom runtime connection interrupted. Please ensure the local service is active and try again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Elegant Chat Panel Modal */}
      {isOpen && (
        <div className="mb-3 sm:mb-4 flex h-[min(560px,calc(100dvh-5.5rem))] w-[calc(100vw-2rem)] sm:w-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/15 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#0F172A] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-white shadow-sm shadow-blue-500/20">
                <AxiomSymbol size={24} theme="dark" animated />
                <span className="status-pulse-active absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 opacity-75" />
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0F172A]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[15px] tracking-wide">AXIOM AI</span>
                  <span className="flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[12px] text-slate-400 font-mono">Autonomous Reasoning Node v3.4</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          {/* Conversation history */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 tech-grid-dense">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0F172A] p-0.5 shadow-xs">
                    <AxiomSymbol size={18} theme="dark" />
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-[84%]">
                  <div
                    className={`rounded-2xl px-4 py-3 leading-relaxed text-[14px] ${
                      msg.role === "user"
                        ? "bg-[#2563EB] text-white rounded-br-none shadow-sm font-medium"
                        : "bg-white border border-slate-200/90 text-[#0F172A] rounded-bl-none shadow-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {msg.toolCall && (
                      <div className="mt-2.5 flex items-center gap-1.5 rounded-md bg-blue-50 border border-blue-100 px-2.5 py-1 text-[11px] text-blue-700 font-mono">
                        <Wrench className="h-3 w-3 text-blue-600" />
                        <span>Action: {msg.toolCall.toolName}</span>
                        <span className="font-bold text-emerald-600 ml-auto">
                          [{msg.toolCall.status}]
                        </span>
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[10px] text-slate-400 px-1 font-mono ${
                      msg.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-600 text-xs py-2 px-3 bg-white/80 rounded-lg border border-slate-200/60 w-fit">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2563EB]" />
                <span className="font-mono text-[11px]">Synthesizing workflow reasoning...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="border-t border-slate-100 bg-white px-3.5 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Quick Actions
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => handleSend(action)}
                  className="rounded-full border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-[#2563EB] px-3 py-1 text-[12px] font-medium text-slate-600 transition-all flex items-center gap-1 active:scale-95"
                >
                  <span>{action}</span>
                  <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="border-t border-slate-200 bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Axiom AI about your workflow..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14px] outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60 text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white transition hover:bg-[#1D4ED8] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 shadow-xs"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating AI Assistant Trigger Button with Tooltip */}
      <div className="relative flex items-center justify-end">
        {/* Tooltip (desktop only) */}
        {!isOpen && showTooltip && (
          <div className="hidden sm:block absolute right-16 px-3 py-1.5 rounded-lg bg-[#0F172A] text-white text-[12px] font-medium tracking-wide shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-right-1 duration-150 border border-slate-700">
            Ask Axiom AI
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-[#0F172A]" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label={isOpen ? "Close Axiom AI" : "Ask Axiom AI"}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0F172A] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-[#2563EB] border border-slate-700/50"
        >
          {isOpen ? (
            <X className="h-6 w-6 transition-transform group-hover:rotate-90 text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              <AxiomSymbol size={26} theme="dark" />
              {/* Radar Pulse Badge */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="status-pulse-active absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#0F172A]" />
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
