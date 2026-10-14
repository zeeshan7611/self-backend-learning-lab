import React, { useState } from 'react';
import { 
  Code2, 
  Lightbulb, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Check, 
  Play,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';
import { CodingExercise, UserProgressState } from '../types';
import { CODING_EXERCISES } from '../data/exercises';

interface CodingPracticeViewProps {
  state: UserProgressState;
  onUpdateState: (newState: Partial<UserProgressState>) => void;
}

export const CodingPracticeView: React.FC<CodingPracticeViewProps> = ({
  state,
  onUpdateState
}) => {
  const [selectedExId, setSelectedExId] = useState<string>(CODING_EXERCISES[0].id);
  const [selectedLang, setSelectedLang] = useState<'java' | 'python'>('java');
  const [activeHintLevel, setActiveHintLevel] = useState<number>(0);
  const [userCode, setUserCode] = useState<string>('');
  const [verifiedSuccess, setVerifiedSuccess] = useState<boolean>(false);
  const [selfAssessCriteria, setSelfAssessCriteria] = useState<Record<string, boolean>>({});
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const currentExercise = CODING_EXERCISES.find(e => e.id === selectedExId) || CODING_EXERCISES[0];
  const isCompleted = state.completedExercises.includes(currentExercise.id);

  // Initialize starter code when switching exercise or language
  React.useEffect(() => {
    setUserCode(currentExercise.starterCode[selectedLang]);
    setActiveHintLevel(0);
    setVerifiedSuccess(false);
    setSelfAssessCriteria({});
  }, [selectedExId, selectedLang]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleToggleCriteria = (idx: number) => {
    const key = `c-${idx}`;
    setSelfAssessCriteria(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMarkExerciseComplete = () => {
    let updated: string[];
    if (isCompleted) {
      updated = state.completedExercises.filter(id => id !== currentExercise.id);
    } else {
      updated = [...state.completedExercises, currentExercise.id];
    }
    onUpdateState({ completedExercises: updated });
  };

  const allCriteriaChecked = currentExercise.verificationCriteria.every((_, idx) => selfAssessCriteria[`c-${idx}`]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Backend Coding Practice & Assessment Engine
          </h1>
          <p className="text-sm text-slate-500">
            Progressive 5-tier hint system, honest self-evaluation, and language-comparable problem solving.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">Completed:</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
            {state.completedExercises.length} / {CODING_EXERCISES.length} Solved
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Exercise Selector List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Curated Practice Challenges
          </h2>
          <div className="space-y-2">
            {CODING_EXERCISES.map((ex) => {
              const isSelected = ex.id === selectedExId;
              const isExDone = state.completedExercises.includes(ex.id);
              return (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExId(ex.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {ex.category}
                    </span>
                    <span className={`text-[10px] font-bold ${
                      ex.difficulty === 'Beginner' ? 'text-emerald-600' : ex.difficulty === 'Elementary' ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      {ex.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-xs mt-2 leading-snug">
                    {ex.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                    <span>Est: {ex.estimatedMinutes} mins</span>
                    <span className={`flex items-center space-x-1 font-semibold ${isExDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isExDone ? 'Solved' : 'Unsolved'}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Problem Workspace & Progressive Hints (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Problem Statement Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{currentExercise.title}</h2>
                <span className="text-xs text-slate-500">{currentExercise.category} • {currentExercise.difficulty}</span>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setSelectedLang('java')}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                    selectedLang === 'java' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Java
                </button>
                <button
                  onClick={() => setSelectedLang('python')}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                    selectedLang === 'python' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Python
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {currentExercise.description}
            </p>

            {/* Examples */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Input / Output Examples
              </h3>
              <div className="space-y-2">
                {currentExercise.inputOutputExamples.map((ex, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-mono text-xs space-y-1">
                    <div><span className="text-slate-400">Input: </span><span className="text-slate-800">{ex.input}</span></div>
                    <div><span className="text-slate-400">Output: </span><span className="text-indigo-600 font-bold">{ex.output}</span></div>
                    {ex.explanation && (
                      <div className="text-[11px] text-slate-500 font-sans italic pt-0.5">
                        Note: {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints & Learning Outcome */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900">Constraints:</span>
                <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
                  {currentExercise.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950">
                <span className="font-bold text-indigo-900">Learning Outcome:</span>
                <p className="mt-1 leading-relaxed">{currentExercise.learningOutcome}</p>
              </div>
            </div>
          </div>

          {/* Interactive Code Editor Simulator */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-md text-white">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Solution Editor ({selectedLang.toUpperCase()})</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setUserCode(currentExercise.starterCode[selectedLang])}
                  className="p-1.5 text-slate-400 hover:text-white rounded"
                  title="Reset starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleCopy(userCode)}
                  className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full bg-slate-900 text-emerald-300 font-mono text-xs p-4 focus:outline-none min-h-[220px] leading-relaxed resize-y"
              spellCheck={false}
            />
          </div>

          {/* Self-Assessment Verification Criteria */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Transparent Self-Evaluation Checklist</span>
            </h3>
            <p className="text-xs text-slate-500">
              Verify your solution against these test invariants before marking the exercise solved:
            </p>

            <div className="space-y-2">
              {currentExercise.verificationCriteria.map((crit, idx) => {
                const key = `c-${idx}`;
                const checked = selfAssessCriteria[key] || false;
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleCriteria(idx)}
                    className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer text-xs transition-all ${
                      checked ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {checked && <Check className="w-3 h-3" />}
                    </div>
                    <span>{crit}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                {allCriteriaChecked ? 'All criteria satisfied!' : 'Check all criteria to confirm completion'}
              </span>

              <button
                onClick={handleMarkExerciseComplete}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Solved (Mark Incomplete)' : 'Mark Solved'}</span>
              </button>
            </div>
          </div>

          {/* Progressive 5-Tier Hint System */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Progressive 5-Tier Hint Ladder</span>
              </h3>
              <span className="text-xs text-slate-400">Step {activeHintLevel} of 5 Revealed</span>
            </div>

            <div className="space-y-3">
              {[
                { level: 1, title: 'Tier 1: Problem Clarification', content: currentExercise.hints.step1ProblemExplanation },
                { level: 2, title: 'Tier 2: Conceptual Hint', content: currentExercise.hints.step2ConceptualHint },
                { level: 3, title: 'Tier 3: Suggested Algorithm Approach', content: currentExercise.hints.step3SuggestedApproach },
                { level: 4, title: 'Tier 4: Pseudocode Blueprint', content: currentExercise.hints.step4Pseudocode, isCode: true },
                { 
                  level: 5, 
                  title: `Tier 5: Explained Model Solution (${selectedLang.toUpperCase()})`, 
                  content: selectedLang === 'java' ? currentExercise.hints.step5JavaSolution : currentExercise.hints.step5PythonSolution, 
                  isCode: true 
                }
              ].map((hint) => {
                const isRevealed = activeHintLevel >= hint.level;
                return (
                  <div key={hint.level} className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <button
                      onClick={() => setActiveHintLevel(prev => prev >= hint.level ? hint.level - 1 : hint.level)}
                      className={`w-full p-3 text-left font-semibold flex items-center justify-between transition-colors ${
                        isRevealed ? 'bg-amber-50/70 text-amber-950 border-b border-slate-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{hint.title}</span>
                      <ChevronRight className={`w-4 h-4 transform transition-transform ${isRevealed ? 'rotate-90 text-amber-600' : 'text-slate-400'}`} />
                    </button>

                    {isRevealed && (
                      <div className="p-4 bg-white text-slate-800 leading-relaxed">
                        {hint.isCode ? (
                          <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
                            <code>{hint.content}</code>
                          </pre>
                        ) : (
                          <p>{hint.content}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
