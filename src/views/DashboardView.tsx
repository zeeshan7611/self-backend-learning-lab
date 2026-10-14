import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  Target, 
  Award, 
  Flame, 
  Code2, 
  FileText,
  ChevronRight,
  HelpCircle,
  ExternalLink,
  Settings
} from 'lucide-react';
import { UserProgressState, DayLesson } from '../types';
import { getLessonByDay, ALL_LESSONS } from '../data/curriculum';

interface DashboardViewProps {
  state: UserProgressState;
  onUpdateState: (newState: Partial<UserProgressState>) => void;
  onNavigateToDay: (day: number) => void;
  onSelectTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onUpdateState,
  onNavigateToDay,
  onSelectTab
}) => {
  const [dailyNoteInput, setDailyNoteInput] = useState(state.dailyNotes[state.currentDay] || '');
  const [isSavedNote, setIsSavedNote] = useState(false);

  const currentLesson: DayLesson = getLessonByDay(state.currentDay) || ALL_LESSONS[0];
  const completedCount = state.completedDays.length;
  const progressPercent = Math.round((completedCount / 25) * 100);
  const isCurrentDayCompleted = state.completedDays.includes(state.currentDay);

  // Milestone calculation:
  const currentWeek = Math.ceil(state.currentDay / 7);
  const weeklyMilestones = [
    { week: 1, title: "Rebuild Programming Foundations", focus: "Terminal, Git, Types, Conditions, Loops, OOP & HashMaps" },
    { week: 2, title: "Core Depth & Primary Track Selection", focus: "Exceptions, Big-O, Day 10 Diagnostic & Track Choice" },
    { week: 3, title: "Relational DBs, REST APIs & Frameworks", focus: "PostgreSQL, HTTP, Spring Boot / FastAPI, CRUD & 3-Tier Layering" },
    { week: 4, title: "Portfolio Capstone & Interview Launch", focus: "Validation, Testing, Security, Capstone API & Resume Preparation" }
  ];

  const handleToggleCurrentDay = () => {
    let updatedCompleted: number[];
    if (isCurrentDayCompleted) {
      updatedCompleted = state.completedDays.filter(d => d !== state.currentDay);
    } else {
      updatedCompleted = [...state.completedDays, state.currentDay];
    }
    onUpdateState({ completedDays: updatedCompleted });
  };

  const handleSaveDailyNote = () => {
    const updatedNotes = { ...state.dailyNotes, [state.currentDay]: dailyNoteInput };
    onUpdateState({ dailyNotes: updatedNotes });
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 2000);
  };

  // Calculate target date for current day based on start date
  const computeDateForDay = (startStr: string, dayNum: number) => {
    const date = new Date(startStr);
    date.setDate(date.getDate() + (dayNum - 1));
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intensive Practical Backend Launch</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Backend Launch Lab
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              25 Days from CS Graduate to Practical Backend Developer. Built for Indian graduates to master real-world coding, write clean APIs, test defensively, and build a verified portfolio capstone.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onSelectTab('workspace')}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Continue Day {state.currentDay}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('roadmap')}
              className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all text-center"
            >
              Full Roadmap
            </button>
          </div>
        </div>

        {/* Realism Disclaimer Alert */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-300">Crucial Realism Notice:</strong> Completing this 25-day roadmap builds essential practical engineering habits, but does NOT magically guarantee employment. True job readiness is demonstrated through assessment rigor, independent problem-solving, and the architectural quality of your Capstone code.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Overall Progress</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{completedCount} / 25 <span className="text-sm font-medium text-slate-500 font-normal">Days</span></div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">{progressPercent}% of curriculum completed</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Target Hours</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">~140 <span className="text-sm font-medium text-slate-500 font-normal">Hours</span></div>
          <div className="mt-3 text-[11px] text-slate-500 leading-snug">
            Planned at 5.5–6 hours/day of focused deliberate coding.
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Primary Track</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 capitalize truncate">
            {state.selectedTrack === 'undecided' ? 'Deciding on Day 10' : `${state.selectedTrack} + Framework`}
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            {state.selectedTrack === 'java' && 'Spring Boot + PostgreSQL'}
            {state.selectedTrack === 'python' && 'FastAPI + PostgreSQL'}
            {state.selectedTrack === 'undecided' && 'Dual-language comparison phase'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Course Calendar</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-slate-900">
            Started: {computeDateForDay(state.startDate, 1)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Target Finish: {computeDateForDay(state.startDate, 25)}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Today's Active Focus */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Focus Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold font-mono">
                    DAY {state.currentDay} of 25
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Scheduled: {computeDateForDay(state.startDate, state.currentDay)}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {currentLesson.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{currentLesson.subtitle}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleCurrentDay}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    isCurrentDayCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isCurrentDayCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{isCurrentDayCompleted ? 'Completed' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                <span>Today's Learning Objectives ({currentLesson.timeAllocationHours} Hours Planned)</span>
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                {currentLesson.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Coding Assignment Preview */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 flex items-center space-x-1.5">
                  <Code2 className="w-4 h-4 text-indigo-700" />
                  <span>Hands-on Deliverable: {currentLesson.practicalDeliverable.title}</span>
                </span>
                <span className="text-[11px] font-medium text-indigo-700">Required Deliverable</span>
              </div>
              <p className="text-xs text-indigo-950 leading-relaxed">
                {currentLesson.practicalDeliverable.description}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onSelectTab('workspace')}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center space-x-1 group"
                >
                  <span>Open Full Workspace & Code Solutions</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Daily Reflection & Notes */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>Daily Learning Journal & Notes (Day {state.currentDay})</span>
                </label>
                {isSavedNote && (
                  <span className="text-[11px] text-emerald-600 font-semibold animate-fade-in">
                    Saved to local storage!
                  </span>
                )}
              </div>
              <textarea
                value={dailyNoteInput}
                onChange={(e) => setDailyNoteInput(e.target.value)}
                placeholder="Write what you discovered today, questions you have, or bugs you debugged..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[90px] text-slate-800 placeholder:text-slate-400 bg-slate-50"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveDailyNote}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-sm"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>

          {/* Outstanding Tasks & Project Checklist Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span>Capstone Project Tasks (Job Application Tracker API)</span>
              </h3>
              <button
                onClick={() => onSelectTab('capstone')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View Blueprint
              </button>
            </div>
            
            <p className="text-xs text-slate-500">
              The portfolio project you are building throughout the final 5 days. Track progress against the mandatory requirements:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { id: 'p-1', label: 'Relational Schema & Database Migrations' },
                { id: 'p-2', label: 'CRUD Application Endpoints (REST)' },
                { id: 'p-3', label: 'Validation & RFC-7807 Exception Handler' },
                { id: 'p-4', label: 'Search Filtering & Safe Pagination' },
                { id: 'p-5', label: 'Stateless JWT Auth & Password Hashing' },
                { id: 'p-6', label: 'Automated Unit & Integration Test Suite' }
              ].map(item => {
                const checked = state.projectChecklist[item.id] || false;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      const updated = { ...state.projectChecklist, [item.id]: !checked };
                      onUpdateState({ projectChecklist: updated });
                    }}
                    className={`p-2.5 rounded-lg border flex items-center space-x-2.5 cursor-pointer transition-all ${
                      checked 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Weekly Milestones, Quiz Results & Quick Actions */}
        <div className="space-y-6">
          {/* Weekly Milestones */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Weekly Milestones</span>
            </h3>

            <div className="space-y-3">
              {weeklyMilestones.map((m) => {
                const isCurrent = currentWeek === m.week;
                return (
                  <div 
                    key={m.week}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrent 
                        ? 'bg-indigo-50/80 border-indigo-200 ring-1 ring-indigo-500/20' 
                        : 'bg-slate-50 border-slate-200/80 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${isCurrent ? 'text-indigo-900' : 'text-slate-800'}`}>
                        Week {m.week}: {m.title}
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-200/80 text-indigo-900 font-bold uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{m.focus}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Quiz Performance */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Quiz & Assessment Record</span>
              </h3>
            </div>

            {Object.keys(state.quizScores).length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                <p>No quizzes taken yet.</p>
                <button
                  onClick={() => onSelectTab('workspace')}
                  className="mt-2 text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Take Day {state.currentDay} Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(state.quizScores).slice(-4).map(([dayKey, res]) => (
                  <div key={dayKey} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-medium text-slate-700">Day {dayKey} Diagnostic</span>
                    <span className={`px-2 py-0.5 rounded font-bold font-mono ${
                      res.score === res.total ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {res.score} / {res.total}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Start Date Configuration */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              <span>Configurable Start Date</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recalculate your 25-day roadmap schedule by adjusting your starting date:
            </p>
            <input
              type="date"
              value={state.startDate}
              onChange={(e) => onUpdateState({ startDate: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
