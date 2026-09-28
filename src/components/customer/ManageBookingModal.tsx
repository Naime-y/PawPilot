import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TIME_SLOTS } from '../../data/mockData';
import { Appointment } from '../../types';
import { X, Search, Calendar, Clock, AlertCircle, CheckCircle2, User, RefreshCw, Ban } from 'lucide-react';

export const ManageBookingModal: React.FC = () => {
  const {
    manageBookingModalOpen,
    setManageBookingModalOpen,
    findAppointmentByCodeOrPhone,
    rescheduleAppointment,
    cancelAppointment,
    prefilledBookingCode,
    setPrefilledBookingCode,
  } = useApp();

  const [query, setQuery] = useState(prefilledBookingCode || '');
  const [results, setResults] = useState<Appointment[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Cancel state
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!manageBookingModalOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    const matches = findAppointmentByCodeOrPhone(query);
    setResults(matches);
    setHasSearched(true);
    if (matches.length === 1) {
      setSelectedApt(matches[0]);
    } else {
      setSelectedApt(null);
    }
  };

  const handleClose = () => {
    setManageBookingModalOpen(false);
    setSelectedApt(null);
    setIsRescheduling(false);
    setIsCancelling(false);
    setPrefilledBookingCode('');
  };

  const handleConfirmReschedule = () => {
    if (!selectedApt || !newDate || !newTime) return;
    const success = rescheduleAppointment(selectedApt.id, newDate, newTime);
    if (success) {
      setSelectedApt({
        ...selectedApt,
        date: newDate,
        timeSlot: newTime,
        status: 'rescheduled',
      });
      setIsRescheduling(false);
    }
  };

  const handleConfirmCancel = () => {
    if (!selectedApt) return;
    const success = cancelAppointment(selectedApt.id, cancelReason);
    if (success) {
      setSelectedApt({
        ...selectedApt,
        status: 'cancelled',
        cancellationReason: cancelReason || 'Cancelled by customer',
      });
      setIsCancelling(false);
    }
  };

  // Min date today
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-xl w-full p-6 border border-slate-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">Manage Your Grooming Appointment</h3>
          <p className="text-xs text-slate-500 mt-1">
            Search by booking code (e.g. PP-1042) or mobile number to view, reschedule, or cancel.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Enter reference (PP-XXXX) or 10-digit mobile"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-800 text-white rounded-lg text-sm font-medium hover:bg-teal-900 transition-colors shrink-0"
          >
            Find
          </button>
        </form>

        {/* Search Results or Details */}
        {hasSearched && results.length === 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-xs text-amber-800">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>No appointments found matching "{query}". Please check your code or mobile number.</span>
          </div>
        )}

        {results.length > 1 && !selectedApt && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold text-slate-600">Select which appointment to manage:</p>
            {results.map((apt) => (
              <div
                key={apt.id}
                onClick={() => setSelectedApt(apt)}
                className="p-3 border border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50/40 cursor-pointer flex justify-between items-center transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-teal-800">{apt.confirmationCode}</span>
                    <span className="text-xs text-slate-700 font-medium">· {apt.pet.name} ({apt.pet.breed})</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{apt.serviceName} · {apt.date} at {apt.timeSlot}</p>
                </div>
                <span className="text-xs font-medium text-teal-800 underline">View</span>
              </div>
            ))}
          </div>
        )}

        {selectedApt && (
          <div className="space-y-4">
            {/* Appointment Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                      {selectedApt.confirmationCode}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      selectedApt.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedApt.status === 'in_service'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedApt.status === 'rescheduled'
                        ? 'bg-purple-100 text-purple-800'
                        : selectedApt.status === 'completed'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedApt.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-base mt-1">
                    {selectedApt.serviceName}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ₹{selectedApt.totalPriceInr.toLocaleString('en-IN')}
                  </span>
                  <p className="text-[11px] text-slate-500">Pay at studio</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-700">
                <div>
                  <span className="text-slate-500">Pet:</span>{' '}
                  <span className="font-medium">{selectedApt.pet.name} ({selectedApt.pet.breed})</span>
                </div>
                <div>
                  <span className="text-slate-500">Stylist:</span>{' '}
                  <span className="font-medium">{selectedApt.staffName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Date:</span>{' '}
                  <span className="font-medium font-mono">{selectedApt.date}</span>
                </div>
                <div>
                  <span className="text-slate-500">Time:</span>{' '}
                  <span className="font-medium">{selectedApt.timeSlot}</span>
                </div>
              </div>

              {selectedApt.specialRequirements && (
                <div className="text-xs bg-white p-2.5 rounded border border-slate-200 text-slate-600">
                  <span className="font-medium text-slate-800">Special Notes:</span> {selectedApt.specialRequirements}
                </div>
              )}

              {selectedApt.cancellationReason && (
                <div className="text-xs bg-rose-50 p-2.5 rounded border border-rose-200 text-rose-800">
                  <span className="font-medium">Cancellation Reason:</span> {selectedApt.cancellationReason}
                </div>
              )}
            </div>

            {/* Reschedule Form */}
            {isRescheduling && (
              <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                  Select New Date & Slot
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">New Date</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">New Time Slot</label>
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                    >
                      <option value="">Select time</option>
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setIsRescheduling(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReschedule}
                    disabled={!newDate || !newTime}
                    className="px-3 py-1.5 text-xs bg-teal-800 text-white rounded font-medium disabled:opacity-50 hover:bg-teal-900"
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </div>
            )}

            {/* Cancel Form */}
            {isCancelling && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  Confirm Cancellation
                </h4>
                <p className="text-xs text-rose-700">
                  Are you sure you want to cancel this booking? This slot will be opened for other pets in Kalyani Nagar.
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Reason (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Traveling out of station / Pet unwell"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setIsCancelling(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className="px-3 py-1.5 text-xs bg-rose-700 text-white rounded font-medium hover:bg-rose-800"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedApt.status !== 'cancelled' && selectedApt.status !== 'completed' && !isRescheduling && !isCancelling && (
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => {
                    setIsCancelling(true);
                    setIsRescheduling(false);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Cancel Booking</span>
                </button>
                <button
                  onClick={() => {
                    setIsRescheduling(true);
                    setIsCancelling(false);
                    setNewDate(selectedApt.date);
                    setNewTime(selectedApt.timeSlot);
                  }}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reschedule Slot</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
