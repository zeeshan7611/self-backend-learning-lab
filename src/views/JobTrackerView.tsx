import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Calendar, 
  Search, 
  CheckCircle2, 
  Clock, 
  FileDown, 
  Filter
} from 'lucide-react';
import { JobApplication, UserProgressState } from '../types';

interface JobTrackerViewProps {
  state: UserProgressState;
  onUpdateState: (newState: Partial<UserProgressState>) => void;
}

export const JobTrackerView: React.FC<JobTrackerViewProps> = ({
  state,
  onUpdateState
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [status, setStatus] = useState<JobApplication['status']>('Applied');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');

  const applications = state.jobApplications || [];

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      company: company.trim(),
      role: role.trim(),
      jobUrl: jobUrl.trim(),
      applicationDate: new Date().toISOString().split('T')[0],
      followUpDate: followUpDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status,
      notes: notes.trim()
    };

    onUpdateState({ jobApplications: [newApp, ...applications] });

    // Reset Form
    setCompany('');
    setRole('');
    setJobUrl('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    const updated = applications.filter(a => a.id !== id);
    onUpdateState({ jobApplications: updated });
  };

  const handleUpdateStatus = (id: string, newStatus: JobApplication['status']) => {
    const updated = applications.map(a => a.id === id ? { ...a, status: newStatus } : a);
    onUpdateState({ jobApplications: updated });
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(applications, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `job_applications_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = applications.filter(a => {
    if (filterStatus !== 'all' && a.status.toLowerCase() !== filterStatus.toLowerCase()) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || a.notes.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Personal Job Application Tracker
          </h1>
          <p className="text-sm text-slate-500">
            Track your actual job search pipeline locally in your browser. All records are stored strictly in local storage.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportJson}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <FileDown className="w-4 h-4 text-slate-500" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log Application</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, role or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          {['all', 'draft', 'applied', 'screening', 'interview', 'offered', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded capitalize transition-all ${
                filterStatus === s ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-sm">No applications found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Log the actual companies and trainee roles you are targeting with your verified Capstone project.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold inline-flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log First Application</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(app => {
            let badgeColor = 'bg-slate-100 text-slate-700';
            if (app.status === 'Applied') badgeColor = 'bg-blue-100 text-blue-800';
            if (app.status === 'Screening') badgeColor = 'bg-purple-100 text-purple-800';
            if (app.status === 'Interview') badgeColor = 'bg-amber-100 text-amber-800 font-bold';
            if (app.status === 'Offered') badgeColor = 'bg-emerald-100 text-emerald-800 font-bold';
            if (app.status === 'Rejected') badgeColor = 'bg-rose-100 text-rose-800';

            return (
              <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{app.company}</h3>
                    <div className="text-xs text-slate-600 font-medium">{app.role}</div>
                  </div>

                  <select
                    value={app.status}
                    onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border-0 cursor-pointer ${badgeColor}`}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {app.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                    {app.notes}
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-3">
                    <span>Applied: {app.applicationDate}</span>
                    <span className="text-slate-500 font-medium">Follow-up: {app.followUpDate}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {app.jobUrl && (
                      <a 
                        href={app.jobUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-indigo-600 hover:text-indigo-800 p-1"
                        title="Open posting"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Log New Job Application</h3>
            <form onSubmit={handleAddApplication} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Razorpay, Infosys, Swiggy"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Junior Backend Engineer, SDE Trainee"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Posting URL</label>
                <input
                  type="url"
                  placeholder="https://company.com/careers/sde-1"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes & Follow-up Actions</label>
                <textarea
                  placeholder="Submitted customized resume with Capstone repo link..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[70px]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
