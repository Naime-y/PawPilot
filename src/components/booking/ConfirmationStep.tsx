import React from 'react';
import { AppointmentDocument } from '../../types/booking';
import { formatDurationHuman } from '../../services/durationService';
import {
  CheckCircle2,
  Clock,
  Calendar,
  User,
  MapPin,
  Phone,
  FileText,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ConfirmationStepProps {
  appointment: AppointmentDocument;
  onViewAppointments: () => void;
  onReturnHome: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  appointment,
  onViewAppointments,
  onReturnHome,
}) => {
  return (
    <div className="space-y-6 text-center py-4">
      {/* Visual Header */}
      <div className="w-16 h-16 bg-teal-50 text-teal-800 rounded-full flex items-center justify-center mx-auto shadow-xs border border-teal-200">
        <CheckCircle2 className="w-8 h-8 text-teal-700" />
      </div>

      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>Booking Request Received · Status: {appointment.status.toUpperCase()}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mt-2">
          Thank you! We have received your booking request for {appointment.pet.name}.
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Your request has been securely written to Paw & Polish's Cloud Firestore ledger with reference code{' '}
          <span className="font-mono font-bold text-slate-800">{appointment.confirmationCode}</span>.
        </p>
      </div>

      {/* Booking Pass Card */}
      <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Reference Code
            </span>
            <span className="text-lg font-mono font-bold text-teal-900">
              {appointment.confirmationCode}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Status in Firestore
            </span>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              {appointment.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Pet</span>
            <span className="font-bold text-slate-800">
              {appointment.pet.name} ({appointment.pet.breed})
            </span>
            <span className="text-[11px] text-slate-500 block">
              {appointment.pet.weightKg} kg · {appointment.pet.temperament}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Service</span>
            <span className="font-bold text-slate-800">{appointment.serviceName}</span>
            <span className="text-[11px] text-slate-500 block">
              Allocated: {formatDurationHuman(appointment.durationMinutes)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Requested Window</span>
            <span className="font-bold text-slate-800 font-mono">
              {appointment.date}
            </span>
            <span className="text-[11px] text-teal-800 font-medium block">
              {appointment.startTime}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Assigned Stylist</span>
            <span className="font-bold text-slate-800">
              {appointment.staffName || 'Studio Master Stylist'}
            </span>
            <span className="text-[11px] text-slate-500 block">Fear-Free Certified</span>
          </div>
        </div>

        {/* Studio Location Footer */}
        <div className="pt-3 border-t border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
          <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800">Paw & Polish:</span> Plot 14, Lane 7, Near Joggers Park, Kalyani Nagar, Pune - 411006
          </div>
        </div>
      </div>

      {/* Honest Status Explanation */}
      <div className="max-w-md mx-auto p-3.5 bg-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed text-left">
        <span className="font-semibold text-slate-900 block mb-0.5">What happens next?</span>
        Our salon coordinator checks staff table allocations in Kalyani Nagar. You can track this request directly under your appointment history.
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <button
          onClick={onViewAppointments}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View My Bookings</span>
        </button>
        <button
          onClick={onReturnHome}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
        >
          <span>Return to Studio Home</span>
        </button>
      </div>
    </div>
  );
};
