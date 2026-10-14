import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  HelpCircle,
  Map,
  BookOpen,
  Code2,
  FolderGit2,
  UserCheck,
  Compass
} from 'lucide-react';

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const GuidedTourModal: React.FC<TourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "👋 Welcome to Backend Launch Lab!",
      author: "Created by Zeeshan Ansari",
      icon: Compass,
      color: "from-blue-600 to-indigo-600",
      description: "Hi! This interactive lab was made specifically for recent CS graduates who want to build real, practical coding confidence. Let's take a quick 1-minute tour so you know exactly how to use this lab day by day.",
      actionLabel: "Start Quick Tour",
      tab: "dashboard",
      tip: "You don't need any prior backend experience — we take you from Day 1 to a working portfolio API."
    },
    {
      title: "Step 1: Check Your Daily Focus on the Dashboard",
      icon: Compass,
      color: "from-indigo-600 to-purple-600",
      description: "Every day when you open the app, head to the Dashboard. It shows your current day, the 3–4 simple objectives to achieve today, and your planned 5–6 study hours. You can also write personal journal notes here to track what you learned.",
      actionLabel: "Got it! What's next?",
      tab: "dashboard",
      tip: "Tip: You can change your course start date anytime from the Dashboard, and the entire 25-day calendar will adjust for you!"
    },
    {
      title: "Step 2: Follow the 25-Day Visual Roadmap",
      icon: Map,
      color: "from-purple-600 to-pink-600",
      description: "Click '25-Day Roadmap' in the left menu. You'll see all 25 days split into two friendly phases: Days 1–10 (common Java + Python fundamentals) and Days 11–25 (your backend framework deep dive). You can search topics, bookmark days, and mark lessons complete.",
      actionLabel: "Show me the Workspace",
      tab: "roadmap",
      tip: "Tip: Days never auto-complete when you open them. You have full control to check them off when you feel confident."
    },
    {
      title: "Step 3: Learn Hands-on in the Daily Workspace",
      icon: BookOpen,
      color: "from-blue-600 to-cyan-600",
      description: "This is your main classroom! Each lesson explains concepts in plain, friendly English ('💡 In simple words', '🤔 Why do companies care?'). You get runnable Java & Python side-by-side code tabs, a real-world debugging challenge, a short quiz with instant explanations, and copyable AI prompts.",
      actionLabel: "How do I practice coding?",
      tab: "workspace",
      tip: "Tip: Try reading the side-by-side Java and Python snippets to see how the same logic looks in both languages!"
    },
    {
      title: "Step 4: Solve Problems in Coding Practice",
      icon: Code2,
      color: "from-emerald-600 to-teal-600",
      description: "Head to 'Coding Practice' to write real code. If you get stuck, don't worry! We built a 5-tier hint ladder: Tier 1 clarifies the question, Tier 2 gives an intuitive hint, Tier 3 suggests an approach, Tier 4 gives pseudocode, and Tier 5 reveals the explained model solution in Java & Python.",
      actionLabel: "What about the Capstone Project?",
      tab: "practice",
      tip: "Tip: Try to solve it with Tier 1 or 2 first before looking at the full solution!"
    },
    {
      title: "Step 5: Build Your Capstone & Prep for Interviews",
      icon: FolderGit2,
      color: "from-amber-600 to-orange-600",
      description: "In the final week, you build the 'Job Application Tracker API' — a real backend service with PostgreSQL, JWT security, and automated tests. Then, use 'Interview Prep' to test yourself against the 10-Point Readiness Rubric and copy your truthful fresher resume template!",
      actionLabel: "Let's Start Learning!",
      tab: "capstone",
      tip: "Tip: Track your actual job applications in the built-in 'Job Tracker' as you apply to trainee and junior roles."
    }
  ];

  if (!isOpen) return null;

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      const nextStep = step + 1;
      setStep(nextStep);
      onNavigateTab(steps[nextStep].tab);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      onNavigateTab(steps[prevStep].tab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 transform transition-all">
        {/* Header gradient banner */}
        <div className={`p-6 bg-gradient-to-r ${current.color} text-white relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
            <span>Interactive Guided Tour</span>
            <span>•</span>
            <span>Step {step + 1} of {steps.length}</span>
          </div>

          <h3 className="text-xl font-extrabold tracking-tight text-white leading-snug">
            {current.title}
          </h3>

          {current.author && (
            <div className="mt-1 text-xs text-white/90 font-medium">
              {current.author}
            </div>
          )}
        </div>

        {/* Tour Body */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-700 leading-relaxed">
            {current.description}
          </p>

          {/* Pro tip card */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{current.tip}</span>
          </div>

          {/* Step dots indicator */}
          <div className="flex items-center justify-center space-x-1.5 pt-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                onClick={() => {
                  setStep(i);
                  onNavigateTab(steps[i].tab);
                }}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  step === i ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5"
            >
              <span>{current.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
