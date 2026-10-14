import React, { useState } from 'react';
import { 
  FolderGit2, 
  CheckCircle2, 
  Circle, 
  Layers, 
  Database, 
  ShieldCheck, 
  TestTube, 
  FileText, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink,
  Code2,
  Calendar
} from 'lucide-react';
import { UserProgressState } from '../types';

interface CapstoneViewProps {
  state: UserProgressState;
  onUpdateState: (newState: Partial<UserProgressState>) => void;
  onSelectTab: (tab: string) => void;
}

export const CapstoneView: React.FC<CapstoneViewProps> = ({
  state,
  onUpdateState,
  onSelectTab
}) => {
  const [copiedCurl, setCopiedCurl] = useState(false);

  const checklistItems = [
    { id: 'p-1', label: 'Relational Schema & PostgreSQL Setup', desc: 'Design Users and Applications tables with foreign keys and indexes.' },
    { id: 'p-2', label: 'Complete REST CRUD Endpoints', desc: 'POST (create), GET (id & list), PUT/PATCH (update), DELETE (remove).' },
    { id: 'p-3', label: 'DTO Separation & Data Protection', desc: 'Ensure database entity classes are never directly exposed in API endpoints.' },
    { id: 'p-4', label: 'Input Validation (Bean / Pydantic)', desc: 'Prevent negative salaries, blank names, and invalid status values.' },
    { id: 'p-5', label: 'Centralized Global Error Handler', desc: 'Catch exceptions and return clean RFC-7807 JSON errors without leaking stack traces.' },
    { id: 'p-6', label: 'Search Filtering & Capped Pagination', desc: 'Filter by status and company with defensive limit and offset.' },
    { id: 'p-7', label: 'Dashboard Analytics Aggregations', desc: 'Calculate application counts and interview conversion rates via SQL queries.' },
    { id: 'p-8', label: 'Stateless Authentication (JWT)', desc: 'Hash passwords with BCrypt and secure routes behind Bearer token authentication.' },
    { id: 'p-9', label: 'Automated Test Suite (Unit & API)', desc: 'JUnit/Mockito or Pytest with mock repositories and status code assertions.' },
    { id: 'p-10', label: 'Exemplary README & Swagger Documentation', desc: 'Step-by-step local setup instructions, .env.example, and architecture diagram.' }
  ];

  const handleToggleCheck = (id: string) => {
    const updated = {
      ...state.projectChecklist,
      [id]: !state.projectChecklist[id]
    };
    onUpdateState({ projectChecklist: updated });
  };

  const completedChecklistCount = Object.values(state.projectChecklist).filter(Boolean).length;
  const progressPercent = Math.round((completedChecklistCount / checklistItems.length) * 100);

  const sampleCurl = `# Test Capstone API Endpoints:
# 1. Health check
curl -X GET http://localhost:8080/api/v1/health

# 2. Register User
curl -X POST http://localhost:8080/api/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"dev@launchlab.in","password":"SecurePassword123!","fullName":"Rahul Verma"}'

# 3. Create Application
curl -X POST http://localhost:8080/api/v1/applications \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -d '{"companyName":"Google","roleTitle":"Software Engineer - Backend","status":"APPLIED","salaryOffered":1800000}'

# 4. Fetch Analytics Summary
curl -X GET http://localhost:8080/api/v1/analytics/summary \\
  -H "Authorization: Bearer <JWT_TOKEN>"`;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Capstone Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Core Portfolio Capstone Project</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Job Application Tracker API
        </h1>
        <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
          A realistic production-grade RESTful backend that powers your own job search pipeline. Built using your chosen primary track (Spring Boot or FastAPI) with PostgreSQL persistence, defensive validation, automated tests, and stateless authentication.
        </p>

        {/* Capstone Progress Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Capstone Verification Progress</span>
            <span className="font-bold text-indigo-400">{completedChecklistCount} of {checklistItems.length} Milestones Verified ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Architecture Overview Diagram */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>3-Tier Production Architecture</span>
        </h2>
        <p className="text-xs text-slate-500">
          The Capstone enforces strict separation of concerns across transport, business logic, and database persistence layers:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-bold text-indigo-700 text-sm">1. Controller / Router</div>
            <p className="text-slate-600 font-sans text-xs">
              HTTP parsing, path variables, query parameters, `@Valid` / Pydantic schema validation, and returning proper status codes (201, 204, 400).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-bold text-emerald-700 text-sm">2. Service Layer</div>
            <p className="text-slate-600 font-sans text-xs">
              State transition validation, business invariants, `@Transactional` boundaries, and DTO-to-entity mappings without HTTP coupling.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-bold text-blue-700 text-sm">3. Repository / DB</div>
            <p className="text-slate-600 font-sans text-xs">
              Spring Data JPA / SQLModel queries, HikariCP connection pool, PostgreSQL foreign keys, and indexes on `user_id` and `status`.
            </p>
          </div>
        </div>
      </div>

      {/* Sprint Task Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Capstone Implementation & Acceptance Checklist
          </h2>
          <span className="text-xs text-slate-400">Click to verify completed milestones</span>
        </div>

        <div className="space-y-2">
          {checklistItems.map((item) => {
            const isChecked = state.projectChecklist[item.id] || false;
            return (
              <div
                key={item.id}
                onClick={() => handleToggleCheck(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start space-x-3 transition-all ${
                  isChecked 
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[11px] text-slate-500 font-normal">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sample cURL Testing Workflow */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Interactive cURL Execution Script</span>
          </h3>
          <button
            onClick={() => {
              navigator.clipboard.writeText(sampleCurl);
              setCopiedCurl(true);
              setTimeout(() => setCopiedCurl(false), 2000);
            }}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
          </button>
        </div>

        <pre className="text-xs font-mono text-emerald-300 bg-slate-950 p-4 rounded-xl overflow-x-auto leading-relaxed">
          <code>{sampleCurl}</code>
        </pre>
      </div>
    </div>
  );
};
