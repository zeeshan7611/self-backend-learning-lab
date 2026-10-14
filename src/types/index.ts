export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface DayLesson {
  day: number;
  title: string;
  subtitle: string;
  week: number;
  phase: 'Stage A: Common Fundamentals' | 'Stage B: Primary Backend Track';
  timeAllocationHours: number;
  learningObjectives: string[];
  keyTerminology: { term: string; definition: string; analogy?: string }[];
  conceptExplanation: {
    what: string;
    whyNeeded: string;
    howItWorks: string;
    beginnerMistakes: string[];
    backendRelevance: string;
    interviewerPerspective: string;
    howToProveUnderstanding: string;
  };
  javaCodeSnippet?: {
    title: string;
    code: string;
    explanation: string;
  };
  pythonCodeSnippet?: {
    title: string;
    code: string;
    explanation: string;
  };
  frameworkCodeSnippet?: {
    springBoot?: {
      title: string;
      code: string;
      explanation: string;
    };
    fastApi?: {
      title: string;
      code: string;
      explanation: string;
    };
  };
  practicalDeliverable: {
    title: string;
    description: string;
    acceptanceCriteria: string[];
  };
  debuggingTask?: {
    problemTitle: string;
    buggyCode: string;
    language: 'java' | 'python' | 'sql' | 'http';
    bugExplanation: string;
    fixedCode: string;
  };
  checklist: string[];
  quiz: QuizQuestion[];
  interviewQuestions: {
    question: string;
    answer: string;
    tips: string;
  }[];
  reflectionPrompt: string;
  measurableCriteria: string;
  videoTutorial?: {
    title: string;
    embedId: string;
    channel: string;
    duration: string;
    takeaway: string;
  };
  resources: {
    title: string;
    purpose: string;
    url: string;
    isOfficial: boolean;
  }[];
}

export interface CodingExercise {
  id: string;
  title: string;
  category: 'Strings & Arrays' | 'Logic & Loops' | 'OOP' | 'HashMaps & Collections' | 'DSA Fundamentals' | 'SQL & Relational' | 'HTTP & REST APIs' | 'Backend Debugging';
  difficulty: 'Beginner' | 'Elementary' | 'Intermediate';
  estimatedMinutes: number;
  description: string;
  inputOutputExamples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  learningOutcome: string;
  hints: {
    step1ProblemExplanation: string;
    step2ConceptualHint: string;
    step3SuggestedApproach: string;
    step4Pseudocode: string;
    step5JavaSolution: string;
    step5PythonSolution: string;
  };
  starterCode: {
    java: string;
    python: string;
    sql?: string;
  };
  verificationCriteria: string[];
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  jobUrl?: string;
  applicationDate: string;
  followUpDate: string;
  status: 'Draft' | 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Rejected';
  notes: string;
}

export interface TrackScore {
  javaScore: number;
  pythonScore: number;
  recommendedTrack: 'java' | 'python' | 'undecided';
  reasoning: string;
}

export interface UserProgressState {
  startDate: string;
  currentDay: number;
  completedDays: number[];
  bookmarks: number[];
  selectedTrack: 'java' | 'python' | 'undecided';
  dailyNotes: Record<number, string>;
  quizScores: Record<number, { score: number; total: number; timestamp: string }>;
  completedExercises: string[];
  completedDeliverables: Record<number, boolean>;
  projectChecklist: Record<string, boolean>;
  trackAssessment?: TrackScore;
  jobApplications: JobApplication[];
  rubricScores: Record<string, number>;
}
