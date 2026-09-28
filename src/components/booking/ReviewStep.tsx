import React, { useState } from 'react';
import {
  Customer,
  Pet,
  GroomingService,
  DurationBreakdown,
  BookingPreferences,
  BookingRequestData,
} from '../../types/booking';
import { ProposedSlot } from '../../services/availabilityService';
import { formatDurationHuman } from '../../services/durationService';
import {
  User,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Edit2,
  Send,
  Loader2,
} from 'lucide-react';

interface ReviewStepProps {
  customer: Customer;
  pet: Pet;
  service: GroomingService;
  breakdown: DurationBreakdown;
  preferences: BookingPreferences;
  slot: ProposedSlot;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmitBooking: (requestData: BookingRequestData) => void;
  onEditStep: (stepNumber: number) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  customer,
  pet,
  service,
  breakdown,
  preferences,
  slot,
  isSubmitting,
  errorMessage,
  onSubmitBooking,
  onEditStep,
}) => {
  const [agreementChecked, setAgreementChecked] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreementChecked || isSubmitting) return;

    const requestData: BookingRequestData = {
      businessId: 'paw-and-polish-pune',
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      petId: pet.id,
      pet,
      serviceId: service.id,
      serviceName: service.name,
      staffId: slot.assignedStaff.id,
      staffName: slot.assignedStaff.name,
      date: preferences.preferredDate,
      startTime: slot.startTime,
      durationMinutes: breakdown.totalDurationMinutes,
      durationBreakdown: breakdown,
      priceInr: service.priceInr,
      preferences,
      status: 'requested', // Explicitly marked as requested
      notes: preferences.specialNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmitBooking(requestData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Review & Request Appointment
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Please review your booking details before sending your reservation request to Paw & Polish.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Structured Booking Summary Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
        {/* Row 1: Pet & Parent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Companion
              </span>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="text-xs text-teal-800 hover:underline flex items-center gap-1 font-semibold"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Pet</span>
              </button>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {pet.name} ({pet.species === 'dog' ? 'Dog' : 'Cat'})
            </div>
            <div className="text-xs text-slate-600">
              {pet.breed} · {pet.weightKg} kg ·{' '}
              <span className="capitalize font-medium text-teal-900">
                {pet.temperament} temperament
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {pet.isFirstVisit ? '★ First Visit to Paw & Polish' : 'Returning Client'}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pet Parent
              </span>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="text-xs text-teal-800 hover:underline flex items-center gap-1 font-semibold"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Contact</span>
              </button>
            </div>
            <div className="text-sm font-bold text-slate-900">{customer.fullName}</div>
            <div className="text-xs text-slate-600 font-mono">{customer.phone}</div>
            <div className="text-xs text-slate-500">{customer.email}</div>
          </div>
        </div>

        {/* Row 2: Service & Dynamic Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Grooming Package
              </span>
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="text-xs text-teal-800 hover:underline flex items-center gap-1 font-semibold"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change Package</span>
              </button>
            </div>
            <div className="text-sm font-bold text-slate-900">{service.name}</div>
            <div className="text-xs text-slate-600">
              Base duration: {service.durationMinutes} mins
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Calculated Time Allowance
            </span>
            <div className="text-sm font-bold font-mono text-teal-900">
              {formatDurationHuman(breakdown.totalDurationMinutes)} ({breakdown.totalDurationMinutes} mins)
            </div>
            <div className="text-[11px] text-slate-500">
              Includes {breakdown.adjustments.map((a) => `+${a.minutes}m (${a.label.split(' ')[0]})`).join(', ')}
            </div>
          </div>
        </div>

        {/* Row 3: Schedule & Assigned Stylist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Appointment Schedule
              </span>
              <button
                type="button"
                onClick={() => onEditStep(5)}
                className="text-xs text-teal-800 hover:underline flex items-center gap-1 font-semibold"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change Slot</span>
              </button>
            </div>
            <div className="text-sm font-bold text-slate-900 font-mono">
              {preferences.preferredDate} at {slot.startTime}
            </div>
            <div className="text-xs text-slate-500">
              {preferences.flexibleDate ? 'Flexible within ±1 day if required' : 'Strict date requested'}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Assigned Specialist
            </span>
            <div className="text-sm font-bold text-slate-900">{slot.assignedStaff.name}</div>
            <div className="text-xs text-slate-500">
              {slot.assignedStaff.role} · {slot.assignedStaff.specializations.join(', ')}
            </div>
          </div>
        </div>

        {/* Row 4: Notes & Estimated Price */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <span className="text-xs font-semibold text-slate-500">Studio Price (Pay after groom)</span>
            <p className="text-[11px] text-slate-400">Includes all botanical shampoo and ear hygiene checks</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              ₹{service.priceInr.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation & Agreement */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
          <input
            type="checkbox"
            required
            checked={agreementChecked}
            onChange={(e) => setAgreementChecked(e.target.checked)}
            className="w-4 h-4 text-teal-800 rounded focus:ring-teal-700 mt-0.5"
          />
          <div className="text-xs text-slate-700">
            <span className="font-semibold text-slate-900 block">
              I understand this registers a booking request with status "requested"
            </span>
            <span>
              The Kalyani Nagar studio concierge verifies table availability against current appointments before sending final confirmation.
            </span>
          </div>
        </label>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onEditStep(5)}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Availability
          </button>
          <button
            type="submit"
            disabled={!agreementChecked || isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting to Studio Firestore...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Request Booking</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
