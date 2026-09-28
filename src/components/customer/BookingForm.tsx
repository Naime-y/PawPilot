import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Service, PetSpecies } from '../../types';
import { Scissors, Sparkles, AlertCircle, CheckCircle2, User, Phone } from 'lucide-react';

export interface BookingFormData {
  petName: string;
  petBreed: string;
  serviceId: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}

interface BookingFormProps {
  onSuccess?: (formData: BookingFormData) => void;
  className?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, className = '' }) => {
  const { services, showToast } = useApp();
  const { currentUser, userProfile } = useAuth();

  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [customerName, setCustomerName] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phoneNumber || '');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedService = services.find((s) => s.id === serviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!petName.trim()) {
      setErrorMsg('Please enter your pet name.');
      return;
    }
    if (!petBreed.trim()) {
      setErrorMsg('Please specify the pet breed.');
      return;
    }
    if (!serviceId) {
      setErrorMsg('Please select a grooming service.');
      return;
    }

    const payload: BookingFormData = {
      petName: petName.trim(),
      petBreed: petBreed.trim(),
      serviceId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      notes: notes.trim(),
    };

    setSubmitted(true);
    showToast(`Grooming request initiated for ${petName}!`, 'success');

    if (onSuccess) {
      onSuccess(payload);
    }
  };

  const handleReset = () => {
    setPetName('');
    setPetBreed('');
    setNotes('');
    setSubmitted(false);
    setErrorMsg('');
  };

  if (submitted) {
    return (
      <div className={`bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center space-y-4 ${className}`}>
        <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-emerald-700" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Request Registered for {petName}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Selected package: <span className="font-semibold text-slate-700">{selectedService?.title}</span> (₹{selectedService?.priceInr.toLocaleString('en-IN')})
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 transition-colors"
        >
          Book Another Grooming Service
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6 ${className}`}
    >
      <div>
        <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider mb-1">
          <Scissors className="w-3.5 h-3.5" />
          <span>Quick Appointment Reservation</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">Pet & Grooming Service Selection</h3>
        <p className="text-xs text-slate-500 mt-1">
          Tell us about your pet and pick from our specialized styling packages at Paw & Polish, Kalyani Nagar.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Pet Name & Breed Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Pet Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Bruno, Simba, Mochi"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Pet Breed <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Golden Retriever, Shih Tzu, Indie, Persian"
            value={petBreed}
            onChange={(e) => setPetBreed(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
          />
        </div>
      </div>

      {/* Grooming Service Type Selection */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Grooming Service Package <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((service) => {
            const isSelected = serviceId === service.id;
            return (
              <div
                key={service.id}
                onClick={() => setServiceId(service.id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-700 bg-teal-50/60 ring-1 ring-teal-700 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-900 leading-snug">
                      {service.title}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 shrink-0">
                      ₹{service.priceInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>⏱ {service.durationMinutes} mins</span>
                  <span className={isSelected ? 'text-teal-800 font-bold' : ''}>
                    {isSelected ? '✓ Selected' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional Contact & Special Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Pet Parent Full Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mobile Number (Pune WhatsApp)
          </label>
          <input
            type="tel"
            placeholder="+91 98230 00000"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Special Notes & Instructions (Optional)
        </label>
        <textarea
          rows={2}
          placeholder="Any sensitivities (e.g. ear sensitivity, dematting, fear of dryers)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
        />
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          Confirm Pet & Service Selection
        </button>
      </div>
    </form>
  );
};
