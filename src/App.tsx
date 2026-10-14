import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { RoadmapView } from './views/RoadmapView';
import { DailyWorkspaceView } from './views/DailyWorkspaceView';
import { CodingPracticeView } from './views/CodingPracticeView';
import { TrackView } from './views/TrackView';
import { CapstoneView } from './views/CapstoneView';
import { InterviewPrepView } from './views/InterviewPrepView';
import { JobTrackerView } from './views/JobTrackerView';
import { ResourcesSettingsView } from './views/ResourcesSettingsView';
import { UserProgressState } from './types';
import { getInitialState, saveState } from './utils/storage';
import { Menu, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [state, setState] = useState<UserProgressState>(getInitialState);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Sync state changes to localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleUpdateState = (patch: Partial<UserProgressState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  const handleNavigateToDay = (day: number) => {
    handleUpdateState({ currentDay: day });
    setCurrentTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    localStorage.removeItem('backend_launch_lab_v1_state');
    setState(getInitialState());
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900 font-sans">
      {/* Responsive Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        state={state}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-bold text-sm tracking-tight flex items-center space-x-1.5">
              <span>Backend Launch Lab</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-indigo-600 font-bold text-white">
              Day {state.currentDay}
            </span>
          </div>
        </header>

        {/* View Router */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              state={state}
              onUpdateState={handleUpdateState}
              onNavigateToDay={handleNavigateToDay}
              onSelectTab={setCurrentTab}
            />
          )}

          {currentTab === 'roadmap' && (
            <RoadmapView
              state={state}
              onNavigateToDay={handleNavigateToDay}
              onUpdateState={handleUpdateState}
            />
          )}

          {currentTab === 'workspace' && (
            <DailyWorkspaceView
              state={state}
              onUpdateState={handleUpdateState}
              onNavigateToDay={handleNavigateToDay}
            />
          )}

          {currentTab === 'practice' && (
            <CodingPracticeView
              state={state}
              onUpdateState={handleUpdateState}
            />
          )}

          {currentTab === 'java-track' && (
            <TrackView
              track="java"
              state={state}
              onUpdateState={handleUpdateState}
              onSelectTab={setCurrentTab}
              onNavigateToDay={handleNavigateToDay}
            />
          )}

          {currentTab === 'python-track' && (
            <TrackView
              track="python"
              state={state}
              onUpdateState={handleUpdateState}
              onSelectTab={setCurrentTab}
              onNavigateToDay={handleNavigateToDay}
            />
          )}

          {currentTab === 'capstone' && (
            <CapstoneView
              state={state}
              onUpdateState={handleUpdateState}
              onSelectTab={setCurrentTab}
            />
          )}

          {currentTab === 'interviews' && (
            <InterviewPrepView
              state={state}
              onUpdateState={handleUpdateState}
            />
          )}

          {currentTab === 'job-tracker' && (
            <JobTrackerView
              state={state}
              onUpdateState={handleUpdateState}
            />
          )}

          {currentTab === 'resources' && (
            <ResourcesSettingsView
              state={state}
              onUpdateState={handleUpdateState}
              onResetProgress={handleResetProgress}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
