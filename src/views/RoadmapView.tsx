import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  ArrowRight, 
  Search, 
  Filter, 
  Bookmark, 
  Clock, 
  Code2, 
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { UserProgressState, DayLesson } from '../types';
import { ALL_LESSONS } from '../data/curriculum';

interface RoadmapViewProps {
  state: UserProgressState;
  onNavigateToDay: (day: number) => void;
  onUpdateState: (newState: Partial<UserProgressState>) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  state,
  onNavigateToDay,
  onUpdateState
}) => {
  const [filterWeek, setFilterWeek] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const computeDateForDay = (startStr: string, dayNum: number) => {
    const date = new Date(startStr);
    date.setDate(date.getDate() + (dayNum - 1));
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const filteredLessons = ALL_LESSONS.filter(l => {
    if (filterWeek !== 'all' && l.week !== filterWeek) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.keyTerminology.some(t => t.term.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const toggleBookmark = (e: React.MouseEvent, day: number) => {
    e.stopPropagation();
    let updated: number[];
    if (state.bookmarks.includes(day)) {
      updated = state.bookmarks.filter(b => b !== day);
    } else {
      updated = [...state.bookmarks, day];
    }
    onUpdateState({ bookmarks: updated });
  };

  const toggleCompletion = (e: React.MouseEvent, day: number) => {
    e.stopPropagation();
    let updated: number[];
    if (state.completedDays.includes(day)) {
      updated = state.completedDays.filter(d => d !== day);
    } else {
      updated = [...state.completedDays, day];
    }
    onUpdateState({ completedDays: updated });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            25-Day Backend Launch Roadmap
          </h1>
          <p className="text-sm text-slate-500">
            Study any day in order or jump to specific topics. Track progress with explicit completion toggles.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts, SQL, OOP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {(['all', 1, 2, 3, 4] as const).map((w) => (
              <button
                key={w}
                onClick={() => setFilterWeek(w)}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterWeek === w
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {w === 'all' ? 'All Weeks' : `Week ${w}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-xl flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
            A
          </div>
          <div className="text-xs">
            <div className="font-bold text-indigo-900">Stage A: Common Fundamentals (Days 1–10)</div>
            <p className="text-indigo-800/80 mt-0.5 leading-relaxed">
              Parallel Java & Python comparison. Master terminal, types, loops, OOP, HashMaps, and Big-O before selecting your backend track on Day 10.
            </p>
          </div>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
            B
          </div>
          <div className="text-xs">
            <div className="font-bold text-emerald-900">Stage B: Primary Backend Track (Days 11–25)</div>
            <p className="text-emerald-800/80 mt-0.5 leading-relaxed">
              Deep dive into Spring Boot or FastAPI: PostgreSQL, REST CRUD, 3-tier architecture, validation, automated testing, and the Capstone project.
            </p>
          </div>
        </div>
      </div>

      {/* Lesson Cards List */}
      <div className="space-y-3">
        {filteredLessons.map((lesson) => {
          const isCompleted = state.completedDays.includes(lesson.day);
          const isBookmarked = state.bookmarks.includes(lesson.day);
          const isCurrent = state.currentDay === lesson.day;
          const quizResult = state.quizScores[lesson.day];

          return (
            <div
              key={lesson.day}
              onClick={() => onNavigateToDay(lesson.day)}
              className={`p-4 md:p-5 rounded-xl border transition-all cursor-pointer bg-white hover:border-indigo-300 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isCurrent 
                  ? 'ring-2 ring-indigo-500 border-indigo-400' 
                  : isCompleted 
                  ? 'border-emerald-200 bg-emerald-50/20' 
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Completion Checkbox */}
                <button
                  onClick={(e) => toggleCompletion(e, lesson.day)}
                  className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border-2 border-slate-300 hover:border-slate-400 bg-white text-transparent'
                  }`}
                  title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      Day {lesson.day}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{computeDateForDay(state.startDate, lesson.day)}</span>
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.timeAllocationHours}h</span>
                    </span>
                    {lesson.day === 10 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        Milestone: Track Selection
                      </span>
                    )}
                    {lesson.day >= 21 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Capstone Phase
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {lesson.subtitle}
                  </p>
                </div>
              </div>

              {/* Badges, Bookmarks, and Action */}
              <div className="flex items-center space-x-3 self-end md:self-center shrink-0">
                {quizResult && (
                  <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
                    Quiz: {quizResult.score}/{quizResult.total}
                  </span>
                )}

                <button
                  onClick={(e) => toggleBookmark(e, lesson.day)}
                  className={`p-2 rounded-lg text-xs transition-colors ${
                    isBookmarked 
                      ? 'text-amber-500 bg-amber-50' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark day'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>

                <div className="flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 pl-2">
                  <span>Open</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
