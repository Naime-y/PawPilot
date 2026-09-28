import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus, Appointment } from '../../types';
import {
  Search,
  Calendar,
  Clock,
  User,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  XCircle,
  AlertCircle,
  Inbox,
} from 'lucide-react';

export const AppointmentsView: React.FC = () => {
  const { appointments, updateAppointmentStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.pet.breed.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesDate = !dateFilter || apt.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const requestedCount = appointments.filter((a) => a.status === 'requested').length;

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Studio Appointments & Inbound Requests</h2>
          <p className="text-xs text-slate-500">
            Real-time appointment schedule, customer booking requests, groomer assignments, and pet intake statuses.
          </p>
        </div>

        {/* Quick Date & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, pet, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-teal-700 w-48 sm:w-56"
            />
          </div>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none font-mono"
          />

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80 w-fit text-xs font-medium">
        {[
          { id: 'all', label: `All (${appointments.length})` },
          { id: 'requested', label: `Pending Requests (${requestedCount})` },
          { id: 'confirmed', label: `Confirmed (${appointments.filter((a) => a.status === 'confirmed').length})` },
          { id: 'in_service', label: `In Service (${appointments.filter((a) => a.status === 'in_service').length})` },
          { id: 'completed', label: `Completed (${appointments.filter((a) => a.status === 'completed').length})` },
          { id: 'cancelled', label: `Cancelled (${appointments.filter((a) => a.status === 'cancelled').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === tab.id
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List / Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Date & Slot</th>
                <th className="py-3 px-4">Pet Details</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Service & Stylist</th>
                <th className="py-3 px-4 text-right">Fee (₹)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No appointments found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-900">
                      {apt.confirmationCode}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-900 font-medium">{apt.date}</div>
                      <div className="text-slate-500 text-[11px]">{apt.timeSlot}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {apt.pet.name}{' '}
                        <span className="text-[11px] font-normal text-slate-500">
                          ({apt.pet.species === 'dog' ? 'Dog' : 'Cat'})
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {apt.pet.breed} · {apt.pet.size}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{apt.customerName}</div>
                      <div className="text-slate-500 text-[11px] font-mono">{apt.customerPhone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{apt.serviceName}</div>
                      <div className="text-teal-800 text-[11px]">Stylist: {apt.staffName}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-slate-900">
                      ₹{apt.totalPriceInr.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          apt.status === 'requested'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'in_service'
                            ? 'bg-blue-100 text-blue-800'
                            : apt.status === 'rescheduled'
                            ? 'bg-purple-100 text-purple-800'
                            : apt.status === 'completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {apt.status === 'requested' ? 'REQUESTED (PENDING)' : apt.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === 'requested' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            title="Confirm Customer Request"
                            className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold"
                          >
                            Accept
                          </button>
                        )}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'in_service')}
                            title="Start Grooming Session"
                            className="p-1 text-blue-700 hover:bg-blue-50 rounded"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        )}
                        {apt.status === 'in_service' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            title="Mark as Completed"
                            className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedAppointment(apt)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Detail Drawer / Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold bg-teal-50 text-teal-900 px-2 py-0.5 rounded border border-teal-200">
                  {selectedAppointment.confirmationCode}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedAppointment.serviceName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Pet</span>
                <span className="font-semibold text-slate-800">
                  {selectedAppointment.pet.name} ({selectedAppointment.pet.breed})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Client</span>
                <span className="font-semibold text-slate-800">
                  {selectedAppointment.customerName} ({selectedAppointment.customerPhone})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Stylist</span>
                <span className="font-semibold text-slate-800">{selectedAppointment.staffName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Slot</span>
                <span className="font-semibold font-mono text-slate-800">
                  {selectedAppointment.date} · {selectedAppointment.timeSlot}
                </span>
              </div>
            </div>

            {selectedAppointment.specialRequirements && (
              <div className="text-xs">
                <span className="font-semibold text-slate-700 block mb-1">
                  Customer Special Requirements & Health Notes:
                </span>
                <p className="bg-amber-50/70 border border-amber-200 p-2.5 rounded-lg text-amber-900">
                  {selectedAppointment.specialRequirements}
                </p>
              </div>
            )}

            {/* Quick Status Changers */}
            <div className="pt-3 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-600 block mb-2">Update Status:</span>
              <div className="flex flex-wrap gap-2">
                {(['requested', 'confirmed', 'in_service', 'completed', 'cancelled'] as AppointmentStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment.id, st);
                        setSelectedAppointment({
                          ...selectedAppointment,
                          status: st,
                        });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                        selectedAppointment.status === st
                          ? 'bg-teal-800 text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
