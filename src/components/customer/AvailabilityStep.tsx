import React, { useState, useMemo } from 'react';
import { StaffMember, Appointment, PetSpecies } from '../../types';
import { TIME_SLOTS } from '../../data/mockData';
import { Calendar as CalendarIcon, Clock, User, CheckCircle2 } from 'lucide-react';

interface AvailabilityStepProps {
  staff: StaffMember[];
  appointments: Appointment[];
  selectedStaffId: string;
  selectedDate: string;
  selectedTimeSlot: string;
  petSpecies: PetSpecies;
  serviceDuration: number;
  onSelectStaff: (staffId: string) => void;
  onSelectDate: (date: string) => void;
  onSelectTimeSlot: (slot: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AvailabilityStep: React.FC<AvailabilityStepProps> = ({
  staff,
  appointments,
  selectedStaffId,
  selectedDate,
  selectedTimeSlot,
  petSpecies,
  serviceDuration,
  onSelectStaff,
  onSelectDate,
  onSelectTimeSlot,
  onNext,
  onBack,
}) => {
  // Generate next 10 dates starting today
  const availableDates = useMemo(() => {
    const list = [];
    const base = new Date();
    for (let i = 0; i < 10; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      // Monday closed check
      const isMonday = d.getDay() === 1;
      list.push({
        iso,
        dayName,
        dayNum,
        isMonday,
      });
    }
    return list;
  }, []);

  // Filter stylists active and suitable
  const activeStaff = staff.filter((s) => s.active);

  // Compute booked slots on the chosen date for chosen staff
  const bookedSlots = useMemo(() => {
    if (!selectedDate) return new Set<string>();
    return new Set(
      appointments
        .filter(
          (apt) =>
            apt.date === selectedDate &&
            apt.status !== 'cancelled' &&
            (selectedStaffId === 'any' || !selectedStaffId || apt.staffId === selectedStaffId)
        )
        .map((apt) => apt.timeSlot)
    );
  }, [appointments, selectedDate, selectedStaffId]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Select Appointment Date & Time Slot
        </h3>
        <p className="text-xs text-slate-500">
          Studio operates Tuesday through Sunday. Reserved slots allow dedicated one-on-one attention ({serviceDuration} mins).
        </p>
      </div>

      {/* Stylist Preference */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Select Stylist Preference
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => onSelectStaff('any')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedStaffId === 'any' || !selectedStaffId
                ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>First Available Stylist</span>
              <span className="text-teal-700">★</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Fastest booking with any certified specialist
            </p>
          </button>

          {activeStaff.map((member) => (
            <button
              type="button"
              key={member.id}
              onClick={() => onSelectStaff(member.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedStaffId === member.id
                  ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">{member.name}</div>
              <div className="text-[11px] text-teal-700 font-medium">{member.role}</div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {member.specializations.join(' · ')}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Date Picker Ribbon */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Select Date
        </label>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {availableDates.map((item) => {
            const isSelected = selectedDate === item.iso;
            if (item.isMonday) {
              return (
                <div
                  key={item.iso}
                  className="p-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center opacity-50 cursor-not-allowed"
                >
                  <span className="block text-[11px] font-semibold text-slate-400">{item.dayName}</span>
                  <span className="block text-xs text-slate-400">{item.dayNum}</span>
                  <span className="block text-[9px] text-rose-500 mt-0.5">Closed</span>
                </div>
              );
            }
            return (
              <button
                type="button"
                key={item.iso}
                onClick={() => {
                  onSelectDate(item.iso);
                  // clear slot if previously selected
                  onSelectTimeSlot('');
                }}
                className={`p-2 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'border-teal-700 bg-teal-800 text-white font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`block text-[11px] font-semibold ${isSelected ? 'text-teal-200' : 'text-slate-500'}`}>
                  {item.dayName}
                </span>
                <span className="block text-xs font-mono">{item.dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Picker Matrix */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Select Time Slot for {selectedDate || 'chosen date'}
        </label>
        {!selectedDate ? (
          <p className="text-xs text-slate-400 italic">Please select a date above first.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TIME_SLOTS.map((slot) => {
              const isBooked = bookedSlots.has(slot);
              const isSelected = selectedTimeSlot === slot;
              return (
                <button
                  type="button"
                  key={slot}
                  disabled={isBooked}
                  onClick={() => onSelectTimeSlot(slot)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    isBooked
                      ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                      : isSelected
                      ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-mono tabular-nums">{slot}</div>
                  <div className="text-[10px] mt-0.5">
                    {isBooked ? 'Reserved' : isSelected ? 'Selected' : 'Available'}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Special Requirements
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedDate || !selectedTimeSlot}
          className="px-5 py-2.5 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          Review & Confirm Booking →
        </button>
      </div>
    </div>
  );
};
