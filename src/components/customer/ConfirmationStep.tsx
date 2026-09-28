import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service, StaffMember, Appointment } from '../../types';
import { PetFormData } from './PetInfoStep';
import { CheckCircle, Calendar, Clock, User, MapPin, Phone, ShieldCheck, Copy, ArrowRight } from 'lucide-react';

interface ConfirmationStepProps {
  petData: PetFormData;
  selectedService: Service;
  selectedStaff: StaffMember | undefined;
  date: string;
  timeSlot: string;
  specialRequirements: string;
  onBack: () => void;
  onReset: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  petData,
  selectedService,
  selectedStaff,
  date,
  timeSlot,
  specialRequirements,
  onBack,
  onReset,
}) => {
  const { business, createAppointment, setManageBookingModalOpen, setPrefilledBookingCode } = useApp();
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFinalConfirm = () => {
    const apt = createAppointment({
      customerName: petData.ownerName,
      customerPhone: petData.ownerPhone,
      customerEmail: petData.ownerEmail,
      pet: {
        name: petData.name,
        species: petData.species,
        breed: petData.breed,
        size: petData.size,
        weightKg: petData.weightKg,
        ageYears: petData.ageYears,
        coatType: petData.coatType,
      },
      serviceId: selectedService.id,
      staffId: selectedStaff?.id || 'st-1',
      date,
      timeSlot,
      specialRequirements,
    });
    setConfirmedApt(apt);
  };

  const copyCode = () => {
    if (!confirmedApt) return;
    navigator.clipboard.writeText(confirmedApt.confirmationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If already confirmed, show confirmation pass / voucher
  if (confirmedApt) {
    return (
      <div className="space-y-6 text-center py-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-8 h-8 text-emerald-700" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Booking Successfully Confirmed
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            We are excited to pamper {petData.name}!
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Your appointment has been logged in PawPilot. A confirmation WhatsApp message has been scheduled for {petData.ownerPhone}.
          </p>
        </div>

        {/* Confirmation Pass Card */}
        <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Booking Reference</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-mono font-bold text-teal-900 tracking-wider">
                  {confirmedApt.confirmationCode}
                </span>
                <button
                  onClick={copyCode}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  title="Copy reference code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {copied && <span className="text-[11px] text-emerald-600">Copied!</span>}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Amount Due</span>
              <div className="text-lg font-mono font-bold text-slate-900 tabular-nums">
                ₹{confirmedApt.totalPriceInr.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400">Pay after grooming</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Service</span>
              <span className="font-semibold text-slate-900">{confirmedApt.serviceName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Assigned Stylist</span>
              <span className="font-semibold text-slate-900">{confirmedApt.staffName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Appointment Date</span>
              <span className="font-semibold font-mono text-slate-900">{confirmedApt.date}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Time Slot</span>
              <span className="font-semibold text-slate-900">{confirmedApt.timeSlot}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">{business.name}:</span> {business.address}, {business.neighborhood}, {business.city}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => {
              setPrefilledBookingCode(confirmedApt.confirmationCode);
              setManageBookingModalOpen(true);
            }}
            className="px-4 py-2.5 bg-teal-50 border border-teal-200 text-teal-900 rounded-lg text-xs font-semibold hover:bg-teal-100 transition-colors"
          >
            Manage / Reschedule / Cancel Later
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2.5 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 transition-colors"
          >
            Book Another Pet Grooming Session
          </button>
        </div>
      </div>
    );
  }

  // Pre-confirmation summary review
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Review & Finalize Appointment
        </h3>
        <p className="text-xs text-slate-500">
          Please verify the grooming package, schedule, and handling notes before instant confirmation.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
        {/* Row 1: Pet & Parent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Pet Details
            </span>
            <div className="text-sm font-bold text-slate-900">
              {petData.name} ({petData.species === 'dog' ? 'Dog' : 'Cat'})
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              {petData.breed} · {petData.size.toUpperCase()} size
              {petData.weightKg ? ` · ${petData.weightKg} kg` : ''}
              {petData.ageYears ? ` · ${petData.ageYears} yrs` : ''}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Pet Parent
            </span>
            <div className="text-sm font-bold text-slate-900">{petData.ownerName}</div>
            <div className="text-xs text-slate-600 mt-0.5">
              Phone: {petData.ownerPhone}
              {petData.ownerEmail ? ` · ${petData.ownerEmail}` : ''}
            </div>
          </div>
        </div>

        {/* Row 2: Service & Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Selected Service
            </span>
            <div className="text-xs font-bold text-slate-900">{selectedService.title}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              {selectedService.durationMinutes} mins duration
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Scheduled Date & Time
            </span>
            <div className="text-xs font-bold text-slate-900 font-mono">{date}</div>
            <div className="text-xs text-teal-800 font-semibold mt-0.5">{timeSlot}</div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Assigned Stylist
            </span>
            <div className="text-xs font-bold text-slate-900">
              {selectedStaff ? selectedStaff.name : 'First Available Specialist'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {selectedStaff ? selectedStaff.role : 'Certified Pet Groomer'}
            </div>
          </div>
        </div>

        {/* Row 3: Special Requirements */}
        {specialRequirements && (
          <div className="text-xs pb-4 border-b border-slate-200">
            <span className="font-semibold text-slate-700 block mb-1">Special Requirements & Notes:</span>
            <p className="text-slate-600 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
              {specialRequirements}
            </p>
          </div>
        )}

        {/* Row 4: Total & Pricing Policy */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs text-slate-500">Estimated Total (Pay at Studio)</span>
            <p className="text-[11px] text-slate-400">Cash, UPI, and Cards accepted on completion</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-mono font-bold text-slate-900 tabular-nums">
              ₹{selectedService.priceInr.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Slot Selection
        </button>
        <button
          type="button"
          onClick={handleFinalConfirm}
          className="px-6 py-2.5 bg-teal-800 text-white rounded-lg text-xs font-bold hover:bg-teal-900 transition-colors shadow-xs"
        >
          Confirm & Book Appointment
        </button>
      </div>
    </div>
  );
};
