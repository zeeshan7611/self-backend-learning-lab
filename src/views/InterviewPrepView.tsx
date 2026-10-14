import React, { useState } from 'react';
import { 
  UserCheck, 
  FileText, 
  Award, 
  HelpCircle, 
  Check, 
  Copy, 
  Sparkles, 
  AlertCircle,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { UserProgressState } from '../types';

interface InterviewPrepViewProps {
  state: UserProgressState;
  onUpdateState: (newState: Partial<UserProgressState>) => void;
}

export const InterviewPrepView: React.FC<InterviewPrepViewProps> = ({
  state,
  onUpdateState
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [practiceAnswerInput, setPracticeAnswerInput] = useState<string>('');
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [copiedResume, setCopiedResume] = useState<boolean>(false);
  const [expandedAnswer, setExpandedAnswer] = useState<Record<number, boolean>>({});

  const interviewQuestions = [
    {
      category: "Fundamentals",
      question: "Is Java pass-by-value or pass-by-reference? What about Python?",
      answer: "Both Java and Python are strictly PASS-BY-VALUE at all times. When an object is passed into a method, what is passed is the copy of the reference pointer address. Modifying the object's internal fields mutates the shared object on the heap, but reassigning the parameter variable inside the function does not change the caller's variable.",
      tips: "Draw a simple diagram with two pointer arrows pointing to the same heap object. Emphasize that pointer reassignment is strictly local."
    },
    {
      category: "OOP",
      question: "Why should backend engineers favor Composition over Inheritance?",
      answer: "Inheritance creates tight compile-time coupling between classes and exposes subclasses to parent implementation details (fragile base class problem). Composition ('has-a') allows components to be swapped or mocked dynamically at runtime via interfaces, reduces cascading bugs, and adheres to the Single Responsibility Principle.",
      tips: "Give an example: 'Instead of an OrderService inheriting from DatabaseConnection, it has a repository injected via an interface.'"
    },
    {
      category: "Databases",
      question: "What is the N+1 Query problem in ORMs (Hibernate/SQLAlchemy) and how do you eliminate it?",
      answer: "The N+1 problem occurs when an application executes 1 initial query to fetch N parent records, and then executes N subsequent secondary queries to fetch child relationships inside an iteration loop. It destroys database throughput. We solve it using JOIN FETCH in JPA or eager joinedload() in SQLAlchemy, loading all data in a single SQL query.",
      tips: "Recite the phrase: '1 query for the parent collection + N queries for each child record.'"
    },
    {
      category: "REST & HTTP",
      question: "What is the difference between 401 Unauthorized and 403 Forbidden in API design?",
      answer: "401 Unauthorized means the user identity is unauthenticated or missing (no token or expired token). 403 Forbidden means the identity is authenticated, but the user lacks sufficient roles/permissions (RBAC) to perform the action.",
      tips: "Add: '401 prompts the user to log in; 403 tells the logged-in user that they cannot touch this resource.'"
    },
    {
      category: "Architecture",
      question: "Why should you use DTOs instead of passing database entity objects directly in controllers?",
      answer: "DTOs decouple the public API contract from internal database schema. Passing entities directly leads to mass assignment vulnerabilities where attackers can inject fields like `is_admin: true`. It also risks leaking sensitive fields like password hashes or triggering LazyInitializationException during JSON serialization.",
      tips: "Mention mass assignment security—interviewers love candidates with security awareness."
    },
    {
      category: "Testing",
      question: "What is the difference between a Unit Test and an Integration Test in backend APIs?",
      answer: "A Unit Test tests a single class (like a Service) in complete isolation by mocking external dependencies (like Repositories or Payment APIs) with tools like Mockito. An Integration Test tests multiple layers collaborating together (Controller + Service + DB) by sending simulated HTTP requests through MockMvc or TestClient.",
      tips: "Mention the Testing Pyramid: invest 70% in fast unit tests and 20% in API integration tests."
    }
  ];

  const resumeTemplate = `# Rahul Verma
Backend Software Developer | B.Tech Computer Science Graduate (2026)
Email: rahul.verma.backend@gmail.com | Mobile: +91 98765 43210
GitHub: github.com/rahulverma-dev | LinkedIn: linkedin.com/in/rahulverma-dev

---

## PROFESSIONAL SUMMARY
Disciplined Computer Science graduate with strong foundations in backend engineering, relational database design, and automated testing. Built and tested production-grade RESTful APIs using Java / Spring Boot and Python / FastAPI with PostgreSQL persistence, declarative validation, and stateless JWT security. Passionate about writing clean, maintainable code adhering to SOLID principles.

---

## TECHNICAL SKILLS
- **Languages**: Java 21 (LTS), Python 3.12, SQL (PostgreSQL, SQLite), Bash
- **Backend Frameworks**: Spring Boot 3.3 (Spring Data JPA, Spring Security), FastAPI, Uvicorn
- **Databases & Tools**: PostgreSQL, HikariCP, Git, GitHub Actions, Docker, Maven, Pip
- **Architecture & Practices**: 3-Tier Layered Architecture, RESTful API Design, DTO Pattern, Input Validation, Global Exception Handling (RFC 7807), ACID Transactions
- **Testing**: JUnit 5, Mockito, Pytest, HTTPX, API Integration Testing

---

## PORTFOLIO PROJECT
### Job Application Tracker API (Spring Boot / FastAPI + PostgreSQL)
*GitHub: github.com/rahulverma-dev/job-application-tracker-api*
- Architected a 3-tier RESTful backend service for tracking multi-stage job search pipelines and conversion analytics.
- Designed a normalized PostgreSQL schema with foreign keys, cascading deletions, and B-Tree indexes on search columns.
- Implemented stateless JWT authentication with salted BCrypt password hashing and custom role authorization middleware.
- Built centralized RFC-7807 global exception handling and declarative input validation, eliminating raw stack trace leaks.
- Optimized analytics queries using SQL-level GROUP BY aggregations, reducing server memory footprint from O(N) to O(1).
- Wrote comprehensive automated test suites using JUnit 5 and Mockito, verifying business invariants and HTTP status contracts.

---

## EDUCATION
**Bachelor of Technology in Computer Science & Engineering** (2022 – 2026)
*State University of Technology* | CGPA: 7.8 / 10.0
- Core Coursework: Data Structures & Algorithms, Database Management Systems (DBMS), Operating Systems, Computer Networks, Object-Oriented Software Engineering`;

  const filteredQuestions = activeCategory === 'all' 
    ? interviewQuestions 
    : interviewQuestions.filter(q => q.category.toLowerCase() === activeCategory.toLowerCase());

  const rubricDimensions = [
    { key: 'fundamentals', label: 'Programming Fundamentals', desc: 'Types, loops, memory models, Stack vs Heap, call stacks' },
    { key: 'problemSolving', label: 'Independent Problem Solving', desc: 'Ability to debug and solve logic challenges without AI copy-paste' },
    { key: 'languageSpecific', label: 'Language Depth (Java or Python)', desc: 'Generics, collections, equals/hashCode, or Pythonic data model' },
    { key: 'sqlDatabases', label: 'SQL & Database Understanding', desc: 'DDL, Joins, ACID, 3NF normalization, and indexing concepts' },
    { key: 'apiDesign', label: 'REST API & HTTP Design', desc: 'Plural nouns, idempotency, status code semantics, and DTO contracts' },
    { key: 'testingValidation', label: 'Testing & Defensive Validation', desc: 'Unit mocks, Arrange-Act-Assert, Bean Validation, and RFC-7807' },
    { key: 'gitArchitecture', label: 'Code Organization & Git', desc: '3-tier layering, semantic Git commits, and exemplary README' },
    { key: 'capstoneQuality', label: 'Capstone Project Quality', desc: 'Functionality, persistence, and verified local execution' },
    { key: 'designTradeoffs', label: 'Ability to Explain Trade-offs', desc: 'Articulating choices (e.g. why Spring vs FastAPI, why BCrypt)' },
    { key: 'interviewCommunication', label: 'Technical Interview Communication', desc: 'Concise answers, honesty on unknowns, and structured responses' }
  ];

  const handleScoreChange = (key: string, val: number) => {
    const updated = { ...state.rubricScores, [key]: val };
    onUpdateState({ rubricScores: updated });
  };

  const totalRubricScore = Object.values(state.rubricScores).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Interview Preparation & Career Readiness</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Backend Interview Prep & Truthful Resume Builder
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Master the core technical and behavioral interview questions asked by hiring managers for junior developer and software trainee roles. Prepare a truthful resume that highlights verified practical projects.
        </p>
      </div>

      {/* 10-Point Job Readiness Rubric */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>10-Point Senior Engineering Readiness Rubric</span>
            </h2>
            <p className="text-xs text-slate-500">Self-assess your demonstrable skills (1 = Beginner, 5 = Job-Ready Trainee)</p>
          </div>
          <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-900">
            Readiness Score: {totalRubricScore} / 50
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rubricDimensions.map(dim => {
            const score = state.rubricScores[dim.key] || 3;
            return (
              <div key={dim.key} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900">{dim.label}</span>
                  <span className="text-indigo-600 font-mono">{score} / 5</span>
                </div>
                <p className="text-[11px] text-slate-500">{dim.desc}</p>
                <div className="flex items-center space-x-1 pt-1">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      onClick={() => handleScoreChange(dim.key, v)}
                      className={`flex-1 py-1 rounded text-[11px] font-bold font-mono transition-all ${
                        score >= v ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Advisory Note:</strong> A score of 35+ indicates solid readiness to interview for Software Trainee, Associate Software Engineer, and Junior Backend roles. If any dimension scores below 3, prioritize that specific area in your 60-day continuation plan.
          </p>
        </div>
      </div>

      {/* Daily Interview Questions & Answer Writing Practice */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Core Backend Interview Questions & Model Answers</span>
            </h2>
            <p className="text-xs text-slate-500">Practice explaining technical mechanics in simple, professional English.</p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {['all', 'fundamentals', 'oop', 'databases', 'rest & http', 'architecture', 'testing'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded capitalize transition-all ${
                  activeCategory === cat ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((iq, idx) => {
            const isExpanded = expandedAnswer[idx] ?? true;
            return (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs space-y-2">
                <button
                  onClick={() => setExpandedAnswer(prev => ({ ...prev, [idx]: !isExpanded }))}
                  className="w-full p-4 text-left font-bold text-slate-900 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-mono">
                      {iq.category}
                    </span>
                    <span>Q: {iq.question}</span>
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="p-4 space-y-3 pt-1">
                    <p className="text-slate-700 leading-relaxed font-sans">
                      <strong className="text-slate-900">Recommended Answer: </strong>
                      {iq.answer}
                    </p>
                    <div className="bg-indigo-50/80 border border-indigo-100 p-2.5 rounded-lg text-[11px] text-indigo-950">
                      <strong className="text-indigo-800">Interviewer Tip: </strong>
                      {iq.tips}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Truthful Entry-Level Resume Template */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Truthful Entry-Level Backend Resume Template (Markdown)
            </h2>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(resumeTemplate);
              setCopiedResume(true);
              setTimeout(() => setCopiedResume(false), 2000);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-xs"
          >
            {copiedResume ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedResume ? 'Copied Resume' : 'Copy Resume'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Never fabricate years of corporate experience or invent fictional companies. This resume template highlights genuine engineering depth: ACID transactions, testing, and clean architecture.
        </p>

        <pre className="text-xs font-mono text-slate-200 bg-slate-950 p-5 rounded-xl overflow-x-auto leading-relaxed border border-slate-800/80">
          <code>{resumeTemplate}</code>
        </pre>
      </div>
    </div>
  );
};
