import React, { useState } from 'react';
import { 
  Settings, 
  ExternalLink, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  ShieldCheck, 
  Database, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { UserProgressState } from '../types';

interface ResourcesSettingsViewProps {
  state: UserProgressState;
  onUpdateState: (newState: Partial<UserProgressState>) => void;
  onResetProgress: () => void;
}

export const ResourcesSettingsView: React.FC<ResourcesSettingsViewProps> = ({
  state,
  onUpdateState,
  onResetProgress
}) => {
  const [resetConfirm, setResetConfirm] = useState(false);
  const [copiedData, setCopiedData] = useState(false);

  const curatedResources = [
    {
      category: "Official Language Documentation",
      links: [
        { title: "Dev.java — Official Oracle Java Portal", desc: "Tutorials on Java 21 LTS, records, virtual threads, and language basics.", url: "https://dev.java/learn/", official: true },
        { title: "Python.org Official 3.12 Tutorial", desc: "CPython core tutorial: data structures, classes, and standard libraries.", url: "https://docs.python.org/3/tutorial/", official: true },
        { title: "Git Official Documentation", desc: "Reference manual and Everyday Git command guide.", url: "https://git-scm.com/docs/gittutorial", official: true }
      ]
    },
    {
      category: "Backend Frameworks & Persistence",
      links: [
        { title: "Spring Boot Official Tutorial", desc: "Building your first RESTful application with Spring Boot.", url: "https://docs.spring.io/spring-boot/tutorial/first-application/", official: true },
        { title: "FastAPI Official Tutorial", desc: "Interactive API generation, Pydantic schemas, and ASGI server.", url: "https://fastapi.tiangolo.com/tutorial/", official: true },
        { title: "SQLBolt Interactive Lessons", desc: "Free in-browser interactive SQL tutorial from SELECT to complex joins.", url: "https://sqlbolt.com/", official: false },
        { title: "PostgreSQL Official Documentation", desc: "SQL syntax, relational constraints, indexing, and EXPLAIN plans.", url: "https://www.postgresql.org/docs/current/", official: true }
      ]
    },
    {
      category: "Clean Architecture & Security Standards",
      links: [
        { title: "OWASP Top 10 Security Risks", desc: "Standard awareness document for developers on web application security.", url: "https://owasp.org/www-project-top-ten/", official: true },
        { title: "IETF RFC 7807 — Problem Details for HTTP APIs", desc: "Standard specification for API error response payloads.", url: "https://datatracker.ietf.org/doc/html/rfc7807", official: true },
        { title: "Docker Getting Started", desc: "Containerizing backend APIs and PostgreSQL databases.", url: "https://docs.docker.com/get-started/", official: true }
      ]
    }
  ];

  const handleExportState = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backend_launch_lab_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.currentDay && Array.isArray(parsed.completedDays)) {
          onUpdateState(parsed);
          alert("Progress state imported successfully!");
        } else {
          alert("Invalid backup format.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Learning Resources & Platform Settings
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          All verified free documentation links, schedule configuration, and local storage data management.
        </p>
      </div>

      {/* Curated Resources Directory */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-slate-900">
          Curated Verified Free Resources
        </h2>

        <div className="space-y-6">
          {curatedResources.map((group, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {group.category}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.links.map((link, lIdx) => (
                  <a
                    key={lIdx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 flex items-start justify-between group transition-all text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 flex items-center space-x-1.5">
                        <span>{link.title}</span>
                        {link.official && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-normal">
                            Official
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{link.desc}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-0.5 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management & Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900">
          Local Storage & Progress Data Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Export / Backup */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="font-bold text-slate-900 flex items-center space-x-2">
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Backup Your Progress</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Export all completed lessons, quiz scores, custom daily notes, and job tracker applications into a portable JSON backup file.
            </p>
            <button
              onClick={handleExportState}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import / Restore */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="font-bold text-slate-900 flex items-center space-x-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Restore from Backup</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Restore previously exported course progress and notes from a JSON file.
            </p>
            <label className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold inline-flex items-center space-x-1.5 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload JSON File</span>
              <input type="file" accept=".json" onChange={handleImportState} className="hidden" />
            </label>
          </div>
        </div>

        {/* Danger Zone: Reset Progress */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Danger Zone: Reset All Progress</span>
          </div>
          <p className="text-xs text-slate-500">
            This will permanently reset all completed days, quiz scores, and bookmarks to day 1 defaults.
          </p>

          {!resetConfirm ? (
            <button
              onClick={() => setResetConfirm(true)}
              className="px-3.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
            >
              Reset All Course Progress
            </button>
          ) : (
            <div className="flex items-center space-x-3 bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs">
              <span className="text-rose-900 font-semibold">Are you absolutely sure?</span>
              <button
                onClick={() => {
                  onResetProgress();
                  setResetConfirm(false);
                }}
                className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
