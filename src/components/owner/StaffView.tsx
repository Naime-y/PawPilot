import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffMember } from '../../types';
import { Plus, UserCheck, UserX, Scissors, ShieldCheck, Check } from 'lucide-react';

export const StaffView: React.FC = () => {
  const { staff, toggleStaffActive } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Stylists & Grooming Crew</h2>
          <p className="text-xs text-slate-500">
            Certified groomers, roster availability, daily pet capacity, and specialties.
          </p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div
            key={member.id}
            className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${
              member.active ? 'border-slate-200 shadow-xs' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{member.name}</h3>
                  <span className="text-xs font-semibold text-teal-800">{member.role}</span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    member.active
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {member.active ? 'Active Today' : 'On Leave'}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {member.bio}
              </p>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Specialties:
                </span>
                <div className="flex flex-wrap gap-1">
                  {member.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Daily Pet Capacity:</span>
                <span className="font-mono font-bold text-slate-900">{member.dailyCapacity} pets / day</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Roster Status:</span>
              <button
                type="button"
                onClick={() => toggleStaffActive(member.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  member.active
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-teal-800 hover:bg-teal-900 text-white'
                }`}
              >
                {member.active ? (
                  <>
                    <UserX className="w-3.5 h-3.5 text-slate-500" />
                    <span>Set On Leave</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-teal-200" />
                    <span>Set Active</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
