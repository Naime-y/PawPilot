import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InquiryStatus, Inquiry } from '../../types';
import { MessageSquare, Phone, Mail, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const InquiriesView: React.FC = () => {
  const { inquiries, updateInquiryStatus } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const filteredInquiries = inquiries.filter((inq) => {
    if (filter === 'all') return true;
    return inq.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Customer Inquiries & Consultations</h2>
          <p className="text-xs text-slate-500">
            Incoming pet parent questions, senior pet accommodation requests, and pre-booking inquiries.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80 w-fit text-xs">
          {[
            { id: 'all', label: `All (${inquiries.length})` },
            { id: 'new', label: `New (${inquiries.filter((i) => i.status === 'new').length})` },
            { id: 'contacted', label: `Contacted (${inquiries.filter((i) => i.status === 'contacted').length})` },
            { id: 'resolved', label: `Resolved (${inquiries.filter((i) => i.status === 'resolved').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Cards */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No inquiries in this category.
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                      inq.status === 'new'
                        ? 'bg-rose-100 text-rose-800'
                        : inq.status === 'contacted'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {inq.status.toUpperCase()}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{inq.subject}</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/70 leading-relaxed">
                "{inq.message}"
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-slate-800">{inq.customerName}</span>
                  <span className="font-mono text-slate-600">{inq.phone}</span>
                  <span className="text-teal-800 font-medium">🐾 {inq.petInfo}</span>
                </div>

                <div className="flex items-center gap-2">
                  {inq.status !== 'contacted' && (
                    <button
                      onClick={() => updateInquiryStatus(inq.id, 'contacted')}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded text-[11px] font-medium"
                    >
                      Mark Contacted
                    </button>
                  )}
                  {inq.status !== 'resolved' && (
                    <button
                      onClick={() => updateInquiryStatus(inq.id, 'resolved')}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded text-[11px] font-medium"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
