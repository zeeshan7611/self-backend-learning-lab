import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Target, 
  BookOpen, 
  Code2, 
  Bug, 
  HelpCircle, 
  Bookmark, 
  ExternalLink, 
  Copy, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  Flame,
  FileQuestion,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { UserProgressState, DayLesson } from '../types';
import { getLessonByDay, ALL_LESSONS } from '../data/curriculum';

interface DailyWorkspaceViewProps {
  state: UserProgressState;
  onUpdateState: (newState: Partial<UserProgressState>) => void;
  onNavigateToDay: (day: number) => void;
}

export const DailyWorkspaceView: React.FC<DailyWorkspaceViewProps> = ({
  state,
  onUpdateState,
  onNavigateToDay
}) => {
  const currentDay = state.currentDay;
  const lesson: DayLesson = getLessonByDay(currentDay) || ALL_LESSONS[0];
  const isCompleted = state.completedDays.includes(currentDay);
  const isBookmarked = state.bookmarks.includes(currentDay);

  const [activeCodeTab, setActiveCodeTab] = useState<'java' | 'python' | 'framework'>('java');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [showDebugFix, setShowDebugFix] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [userNote, setUserNote] = useState(state.dailyNotes[currentDay] || '');
  const [noteSaved, setNoteSaved] = useState(false);

  const handleToggleComplete = () => {
    let updatedCompleted: number[];
    if (isCompleted) {
      updatedCompleted = state.completedDays.filter(d => d !== currentDay);
    } else {
      updatedCompleted = [...state.completedDays, currentDay];
    }
    onUpdateState({ completedDays: updatedCompleted });
  };

  const handleToggleBookmark = () => {
    let updated: number[];
    if (isBookmarked) {
      updated = state.bookmarks.filter(b => b !== currentDay);
    } else {
      updated = [...state.bookmarks, currentDay];
    }
    onUpdateState({ bookmarks: updated });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleCopyAiPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(id);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleSaveNote = () => {
    const updatedNotes = { ...state.dailyNotes, [currentDay]: userNote };
    onUpdateState({ dailyNotes: updatedNotes });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleQuizOptionSelect = (qId: string, optionIdx: number) => {
    if (submittedQuiz) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    lesson.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const updatedQuizScores = {
      ...state.quizScores,
      [currentDay]: {
        score: correctCount,
        total: lesson.quiz.length,
        timestamp: new Date().toISOString()
      }
    };

    onUpdateState({ quizScores: updatedQuizScores });
    setSubmittedQuiz(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Navigation & Day Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <button
            disabled={currentDay <= 1}
            onClick={() => onNavigateToDay(currentDay - 1)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-indigo-100 text-indigo-900">
              Day {lesson.day} of 25
            </span>
            <span className="text-xs text-slate-500 font-medium">{lesson.phase}</span>
          </div>

          <button
            disabled={currentDay >= 25}
            onClick={() => onNavigateToDay(currentDay + 1)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              isBookmarked 
                ? 'border-amber-300 bg-amber-50 text-amber-700' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          <button
            onClick={handleToggleComplete}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs ${
              isCompleted
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Completed Day' : 'Mark Day Complete'}</span>
          </button>
        </div>
      </div>

      {/* Header Title Section */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          {lesson.subtitle}
        </p>
        <div className="flex items-center space-x-4 pt-1 text-xs text-slate-500">
          <span className="flex items-center space-x-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Estimated Allocation: {lesson.timeAllocationHours} Hours</span>
          </span>
          <span className="flex items-center space-x-1 font-medium">
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>Measurable Criterion Defined</span>
          </span>
        </div>
      </div>

      {/* Learning Objectives Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
          <Target className="w-4 h-4 text-indigo-600" />
          <span>Core Learning Objectives</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-800">
          {lesson.learningObjectives.map((obj, i) => (
            <div key={i} className="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
              <span className="leading-relaxed font-medium">{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Terminology & Analogies */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Important Terminology & Concrete Analogies</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {lesson.keyTerminology.map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
              <div className="font-bold text-slate-900 border-b border-slate-200/80 pb-1.5">
                {item.term}
              </div>
              <p className="text-slate-700 leading-relaxed">
                {item.definition}
              </p>
              {item.analogy && (
                <div className="text-[11px] text-indigo-900 bg-indigo-50/80 p-2 rounded-lg border border-indigo-100 leading-snug">
                  <strong className="text-indigo-800">Analogy:</strong> {item.analogy}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Deep Concept Explanation Sections (Educational Content) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Simple Concept Breakdown (Plain English)
            </h2>
            <p className="text-xs text-slate-500">Explained like a friendly senior mentor walking you through real backend code.</p>
          </div>
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full self-start sm:self-center">
            Guided by Zeeshan Ansari
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-800">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">💡 In simple words, what is this?</h3>
              <p className="leading-relaxed text-slate-600">{lesson.conceptExplanation.what}</p>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">🤔 Why do companies actually care about this?</h3>
              <p className="leading-relaxed text-slate-600">{lesson.conceptExplanation.whyNeeded}</p>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">⚙️ What happens behind the scenes?</h3>
              <p className="leading-relaxed text-slate-600">{lesson.conceptExplanation.howItWorks}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5 bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl">
              <h3 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <span>⚠️ Common Traps & Mistakes Beginners Make</span>
              </h3>
              <ul className="space-y-1.5 text-slate-700">
                {lesson.conceptExplanation.beginnerMistakes.map((m, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">🏢 Where will you write this on the job?</h3>
              <p className="leading-relaxed text-slate-600">{lesson.conceptExplanation.backendRelevance}</p>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-indigo-900 text-sm">🎯 How an interviewer will ask you about this:</h3>
              <p className="leading-relaxed text-indigo-950 font-medium bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">{lesson.conceptExplanation.interviewerPerspective}</p>
            </div>
          </div>
        </div>

        {/* Measurable Proof */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs flex items-start space-x-3">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">How you can prove you actually get it: </span>
            <span className="text-slate-300">{lesson.conceptExplanation.howToProveUnderstanding}</span>
          </div>
        </div>
      </div>

      {/* Code Snippets Section (Java vs Python) */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden text-slate-100">
        {/* Code Tabs Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-2">
            {lesson.javaCodeSnippet && (
              <button
                onClick={() => setActiveCodeTab('java')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  activeCodeTab === 'java' 
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Java Example
              </button>
            )}

            {lesson.pythonCodeSnippet && (
              <button
                onClick={() => setActiveCodeTab('python')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  activeCodeTab === 'python' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Python Example
              </button>
            )}
          </div>

          <button
            onClick={() => {
              const activeCode = activeCodeTab === 'java' ? lesson.javaCodeSnippet?.code : lesson.pythonCodeSnippet?.code;
              if (activeCode) handleCopyCode(activeCode);
            }}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white font-medium"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSnippet ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Body */}
        <div className="p-4 md:p-6 overflow-x-auto text-xs font-mono leading-relaxed bg-slate-900">
          {activeCodeTab === 'java' && lesson.javaCodeSnippet && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-400 pb-2 border-b border-slate-800 font-sans">
                <strong>{lesson.javaCodeSnippet.title}:</strong> {lesson.javaCodeSnippet.explanation}
              </div>
              <pre className="text-slate-200">
                <code>{lesson.javaCodeSnippet.code}</code>
              </pre>
            </div>
          )}

          {activeCodeTab === 'python' && lesson.pythonCodeSnippet && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-400 pb-2 border-b border-slate-800 font-sans">
                <strong>{lesson.pythonCodeSnippet.title}:</strong> {lesson.pythonCodeSnippet.explanation}
              </div>
              <pre className="text-slate-200">
                <code>{lesson.pythonCodeSnippet.code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Practical Deliverable Box */}
      <div className="bg-indigo-50/80 rounded-xl border border-indigo-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <h3 className="font-bold text-indigo-950 text-sm md:text-base">
              Practical Deliverable: {lesson.practicalDeliverable.title}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-200 text-indigo-900">
            Mandatory Hands-On
          </span>
        </div>

        <p className="text-xs text-indigo-900 leading-relaxed">
          {lesson.practicalDeliverable.description}
        </p>

        <div className="space-y-2 pt-2 border-t border-indigo-200/60">
          <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
            Acceptance Criteria:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {lesson.practicalDeliverable.acceptanceCriteria.map((crit, i) => (
              <div key={i} className="flex items-start space-x-2 bg-white/80 p-2.5 rounded-lg border border-indigo-100 text-slate-800">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{crit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Debugging Task (if present) */}
      {lesson.debuggingTask && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Bug className="w-4 h-4 text-rose-500" />
              <span>Debugging Gauntlet: {lesson.debuggingTask.problemTitle}</span>
            </h3>
            <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {lesson.debuggingTask.language}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Examine this buggy code commonly written by beginners. Spot the bug before viewing the explanation:
          </p>

          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
            <pre><code>{lesson.debuggingTask.buggyCode}</code></pre>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setShowDebugFix(!showDebugFix)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
            >
              {showDebugFix ? 'Hide Diagnosis & Fix' : 'Reveal Diagnosis & Fixed Code'}
            </button>
          </div>

          {showDebugFix && (
            <div className="space-y-3 pt-3 border-t border-slate-100 animate-fade-in">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <strong>Why This Fails:</strong>
                <p className="leading-relaxed">{lesson.debuggingTask.bugExplanation}</p>
              </div>
              <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                <pre><code>{lesson.debuggingTask.fixedCode}</code></pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Daily Diagnostic Quiz */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Day {currentDay} Diagnostic Assessment</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Test your genuine understanding. Instant explanations provided.</p>
          </div>
          {submittedQuiz && state.quizScores[currentDay] && (
            <div className="text-xs font-mono font-bold px-3 py-1 rounded bg-indigo-100 text-indigo-900">
              Score: {state.quizScores[currentDay].score} / {state.quizScores[currentDay].total}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {lesson.quiz.map((q, qIndex) => {
            const userChoice = quizAnswers[q.id];
            const isCorrect = userChoice === q.correctAnswer;
            return (
              <div key={q.id} className="space-y-3 text-xs">
                <div className="font-semibold text-slate-900 leading-snug">
                  {qIndex + 1}. {q.question}
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = userChoice === optIndex;
                    const isThisCorrect = optIndex === q.correctAnswer;
                    let optStyle = 'border-slate-200 hover:bg-slate-50 bg-white text-slate-700';

                    if (submittedQuiz) {
                      if (isThisCorrect) {
                        optStyle = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold';
                      } else if (isSelected && !isThisCorrect) {
                        optStyle = 'border-rose-300 bg-rose-50 text-rose-900';
                      } else {
                        optStyle = 'border-slate-200 bg-white text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      optStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold';
                    }

                    return (
                      <div
                        key={optIndex}
                        onClick={() => handleQuizOptionSelect(q.id, optIndex)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${optStyle}`}
                      >
                        <span>{opt}</span>
                        {submittedQuiz && isThisCorrect && (
                          <Check className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {submittedQuiz && (
                  <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                    isCorrect ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}>
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          {!submittedQuiz ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs disabled:opacity-40 transition-all shadow-xs"
            >
              Submit Quiz & Check Answers
            </button>
          ) : (
            <button
              onClick={() => {
                setSubmittedQuiz(false);
                setQuizAnswers({});
              }}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Retake Quiz
            </button>
          )}
        </div>
      </div>

      {/* AI Learning Support & Prompts (Dedicated AI Section) */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-6 shadow-md space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-base text-white">
            AI-Assisted Learning Prompts for Day {currentDay}
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Use these calibrated prompts with any AI assistant (ChatGPT, Gemini, Claude). Remember: AI output must be verified, executed, tested, and understood—never blindly copy-pasted.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            {
              id: 'explain',
              title: 'Explain In Simple English',
              prompt: `Explain "${lesson.title}" in simple English. Use a real-world Indian analogy, one small runnable code example, three common beginner mistakes, and two practice exercises. Do not introduce advanced terminology without explaining it first.`
            },
            {
              id: 'debug',
              title: 'Interactive Debugging Guide',
              prompt: `Help me debug my code for "${lesson.title}". Explain what the error means, identify the likely root cause, and guide me with progressive hints before suggesting a fix. Do not write out the entire fixed program for me.`
            },
            {
              id: 'interview',
              title: 'Mock Technical Interviewer',
              prompt: `Act as a senior backend technical interviewer. Ask me 3 entry-level interview questions about "${lesson.title}" one question at a time. Wait for my response, evaluate my answer, point out any technical inaccuracies, and ask a practical follow-up.`
            },
            {
              id: 'review',
              title: 'Clean Code Reviewer',
              prompt: `Review my code for "${lesson.title}" based on readability, SOLID principles, edge cases, naming conventions, and security. Explain the architectural reasoning behind every suggested improvement.`
            }
          ].map(p => (
            <div key={p.id} className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between font-bold text-indigo-300">
                <span>{p.title}</span>
                <button
                  onClick={() => handleCopyAiPrompt(p.prompt, p.id)}
                  className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white"
                >
                  {copiedPrompt === p.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPrompt === p.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed italic bg-slate-900/60 p-2 rounded-lg font-mono">
                "{p.prompt}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Verified Resources */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
          <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
          <span>Verified Free Official Learning Resources</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {lesson.resources.map((res, i) => (
            <a
              key={i}
              href={res.url}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 flex items-start justify-between group transition-all"
            >
              <div>
                <div className="font-bold text-slate-900 group-hover:text-indigo-600 flex items-center space-x-1.5">
                  <span>{res.title}</span>
                  {res.isOfficial && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-normal">
                      Official Doc
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">{res.purpose}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-0.5 ml-2" />
            </a>
          ))}
        </div>
      </div>

      {/* Interview Preparation Questions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span>Day {currentDay} Interview Questions & Walkthroughs</span>
        </h3>
        <div className="space-y-4 text-xs">
          {lesson.interviewQuestions.map((iq, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm">
                Q: {iq.question}
              </div>
              <p className="text-slate-700 leading-relaxed font-sans">
                <strong>Model Answer: </strong>{iq.answer}
              </p>
              <div className="text-[11px] text-indigo-900 bg-indigo-50/80 p-2 rounded-lg border border-indigo-100">
                <strong>Interview Tip: </strong>{iq.tips}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
