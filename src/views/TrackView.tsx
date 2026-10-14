import React from 'react';
import { 
  Coffee, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Database,
  ExternalLink
} from 'lucide-react';
import { UserProgressState } from '../types';

interface TrackViewProps {
  track: 'java' | 'python';
  state: UserProgressState;
  onUpdateState: (newState: Partial<UserProgressState>) => void;
  onSelectTab: (tab: string) => void;
  onNavigateToDay: (day: number) => void;
}

export const TrackView: React.FC<TrackViewProps> = ({
  track,
  state,
  onUpdateState,
  onSelectTab,
  onNavigateToDay
}) => {
  const isSelected = state.selectedTrack === track;

  const handleSelectAsPrimary = () => {
    onUpdateState({ selectedTrack: track });
  };

  const isJava = track === 'java';

  const topics = isJava ? [
    { title: "Core Java Revision & JVM Memory", days: "Days 1–5", desc: "Primitives, heap vs stack, String pool, pass-by-value semantics, and garbage collection mechanics." },
    { title: "Object-Oriented Architecture & Interfaces", days: "Days 6–7", desc: "SOLID principles, encapsulation, polymorphism, interfaces vs abstract classes, and HashMaps." },
    { title: "Maven & Build Automation", days: "Day 13", desc: "POM XML structure, dependency management, transitive dependencies, and plugins." },
    { title: "Spring Boot 3.3 & Embedded Tomcat", days: "Days 13–15", desc: "@RestController, @Service, @Repository, Spring IoC container, and constructor injection." },
    { title: "Spring Data JPA & Hibernate", days: "Day 16", desc: "@Entity, JpaRepository, connection pooling (HikariCP), and eliminating N+1 queries." },
    { title: "Validation & Centralized Error Handling", days: "Day 17", desc: "Bean Validation (@Valid, @NotBlank), @RestControllerAdvice, and RFC-7807 error models." },
    { title: "Automated Testing (JUnit 5 + Mockito)", days: "Day 18", desc: "Unit testing services with Mockito mocks and API integration tests with MockMvc." },
    { title: "Spring Security & Stateless JWT", days: "Day 19", desc: "SecurityFilterChain, BCrypt password hashing, JWT claim generation, and Bearer filters." },
    { title: "Production Logging & Capstone", days: "Days 20–25", desc: "SLF4J/Logback structured logging, MDC trace IDs, and the Job Application Tracker API." }
  ] : [
    { title: "Core Python Revision & CPython Mechanics", days: "Days 1–5", desc: "Dynamic typing, everything-is-an-object, string methods, lists, and pass-by-object-reference." },
    { title: "OOP, Classes & Protocols", days: "Days 6–7", desc: "abc.ABC, @abstractmethod, composition, dictionary hashing, and dataclasses/NamedTuples." },
    { title: "Virtual Environments & Pip", days: "Day 13", desc: "venv isolation, pyproject.toml / requirements.txt, and packaging standards." },
    { title: "FastAPI & Uvicorn ASGI Server", days: "Days 13–15", desc: "Async/await concurrency, path decorators, APIRouter modularization, and Depends() injection." },
    { title: "SQLModel & SQLAlchemy with PostgreSQL", days: "Day 16", desc: "Relational mapping, asyncpg / connection pooling, sessions, and database migrations." },
    { title: "Pydantic V2 Validation & Error Handlers", days: "Day 17", desc: "Field constraints, custom validators, and custom exception handler middleware." },
    { title: "Automated Testing (Pytest + HTTPX)", days: "Day 18", desc: "Fixtures, unittest.mock, and FastAPI TestClient simulating non-blocking HTTP requests." },
    { title: "Stateless Auth, Passlib & PyJWT", days: "Day 19", desc: "OAuth2PasswordBearer, BCrypt hashing, JWT token generation, and route protection." },
    { title: "Structured Logging & Capstone", days: "Days 20–25", desc: "Loguru / Python logging, correlation ID middleware, and the Job Application Tracker API." }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className={`rounded-2xl p-6 md:p-8 border text-white shadow-lg relative overflow-hidden ${
        isJava 
          ? 'bg-gradient-to-r from-orange-950 via-slate-900 to-slate-950 border-orange-800/40' 
          : 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-emerald-800/40'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">
              {isJava ? <Coffee className="w-3.5 h-3.5 text-orange-400" /> : <Terminal className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isJava ? 'Enterprise Java Track' : 'Modern Python Track'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {isJava ? 'Java + Spring Boot Backend Specialization' : 'Python + FastAPI Backend Specialization'}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {isJava 
                ? 'The enterprise gold standard in India and globally: high-throughput fintech, banking, robust compile-time safety, and comprehensive Spring ecosystem.'
                : 'The modern API powerhouse: rapid development, intuitive async I/O, native OpenAPI docs, and the backend backbone of modern AI/ML architectures.'}
            </p>
          </div>

          <div className="shrink-0">
            {isSelected ? (
              <div className="px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Primary Track Selected</span>
              </div>
            ) : (
              <button
                onClick={handleSelectAsPrimary}
                className="px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md transition-all transform hover:-translate-y-0.5"
              >
                Choose as Primary Track
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Module Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Track Curriculum Breakdown (Stage B)
          </h2>
          <span className="text-xs text-slate-500">9 Core Competencies</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topics.map((t, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-900">{t.title}</span>
                <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{t.days}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison & Employment Insights */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Job Market & Architectural Reality in India
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900">Where this stack dominates:</span>
            <p>
              {isJava 
                ? 'Large IT consultancies (TCS, Infosys, Wipro, Cognizant), global investment banks (JPMorgan, Goldman Sachs, Morgan Stanley), payments/fintech (Razorpay, PhonePe, Paytm), and high-throughput enterprise SaaS.'
                : 'Rapid-growth SaaS startups, AI engineering platforms, microservice fleets, healthcare tech, and fast-moving product teams looking for exceptional velocity and clean async architecture.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900">What interviewers test most in this stack:</span>
            <p>
              {isJava 
                ? 'Deep understanding of Spring Boot annotations, Dependency Injection lifecycles, Hibernate N+1 problems, JVM garbage collection concepts, and multi-threading.'
                : 'Async/await event loop mechanics, Pydantic data schemas, SQLAlchemy query efficiency, REST status codes, and unit test isolation with Pytest.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
