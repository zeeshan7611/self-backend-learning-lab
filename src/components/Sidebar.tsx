import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  BookOpen, 
  Code2, 
  Coffee, 
  Terminal, 
  FolderGit2, 
  UserCheck, 
  Briefcase, 
  Settings, 
  CheckCircle2,
  Calendar,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { UserProgressState } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  state: UserProgressState;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  state,
  mobileOpen,
  setMobileOpen
}) => {
  const completedCount = state.completedDays.length;
  const progressPercent = Math.round((completedCount / 25) * 100);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: '25-Day Roadmap', icon: Map, badge: `${completedCount}/25` },
    { id: 'workspace', label: 'Daily Workspace', icon: BookOpen, badge: `Day ${state.currentDay}` },
    { id: 'practice', label: 'Coding Practice', icon: Code2, badge: `${state.completedExercises.length} Done` },
    { id: 'java-track', label: 'Java Track', icon: Coffee, sub: 'Spring Boot' },
    { id: 'python-track', label: 'Python Track', icon: Terminal, sub: 'FastAPI' },
    { id: 'capstone', label: 'Capstone Project', icon: FolderGit2, sub: 'Job Tracker API' },
    { id: 'interviews', label: 'Interview Prep', icon: UserCheck, sub: 'Q&A + Resume' },
    { id: 'job-tracker', label: 'Job Tracker', icon: Briefcase, badge: `${state.jobApplications.length}` },
    { id: 'resources', label: 'Resources & Settings', icon: Settings }
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
            B
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight tracking-tight text-white flex items-center space-x-1.5">
              <span>Backend Launch Lab</span>
            </h1>
            <p className="text-xs text-slate-400">25 Days to Practical Backend</p>
          </div>
        </div>
        <button 
          onClick={() => setMobileOpen(false)} 
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Capsule */}
      <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400 font-medium">Progress</span>
          <span className="font-semibold text-indigo-400">{completedCount} of 25 Days ({progressPercent}%)</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <span className={`w-2 h-2 rounded-full ${state.selectedTrack === 'java' ? 'bg-orange-400' : state.selectedTrack === 'python' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span className="capitalize">{state.selectedTrack === 'undecided' ? 'Track: Choosing on Day 10' : `${state.selectedTrack} Track`}</span>
          </span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
            {25 - completedCount} Days Left
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="text-left truncate">
                  <div className="truncate leading-snug">{item.label}</div>
                  {item.sub && (
                    <div className={`text-[10px] ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {item.sub}
                    </div>
                  )}
                </div>
              </div>
              {item.badge && (
                <span className={`text-[11px] px-2 py-0.5 rounded font-mono font-semibold ${
                  isActive ? 'bg-indigo-700/80 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info & Author Attribution */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/70 text-xs text-slate-400 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Curriculum Creator</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            Author
          </span>
        </div>
        <div className="text-slate-200 font-bold text-xs">
          Zeeshan Ansari
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Crafted in friendly, simple English so every fresh graduate can truly understand backend engineering from scratch.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 h-screen shrink-0 border-r border-slate-800 sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm"
        />
      )}

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {content}
      </div>
    </>
  );
};
