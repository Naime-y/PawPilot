import React, { useState, useEffect } from 'react';
import { Pet, GroomingService, DurationBreakdown } from '../../types/booking';
import { getActiveServices } from '../../services/serviceService';
import { calculateAppointmentDuration, formatDurationHuman } from '../../services/durationService';
import { Clock, Check, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface ServiceStepProps {
  pet: Pet;
  selectedService: GroomingService | null;
  onServiceSelected: (service: GroomingService, breakdown: DurationBreakdown) => void;
  onBack: () => void;
}

export const ServiceStep: React.FC<ServiceStepProps> = ({
  pet,
  selectedService,
  onServiceSelected,
  onBack,
}) => {
  const [services, setServices] = useState<GroomingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeServiceId, setActiveServiceId] = useState<string>(
    selectedService?.id || 'srv_full_groom'
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await getActiveServices('paw-and-polish-pune');
      setServices(list);
      setLoading(false);
    }
    load();
  }, []);

  const chosenService = services.find((s) => s.id === activeServiceId) || services[0];
  const dynamicBreakdown = chosenService
    ? calculateAppointmentDuration(chosenService, pet)
    : null;

  const handleProceed = () => {
    if (chosenService && dynamicBreakdown) {
      onServiceSelected(chosenService, dynamicBreakdown);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Select Grooming Service for {pet.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Showing active spa & styling packages suitable for {pet.species === 'dog' ? 'dogs' : 'cats'}. Appointment durations are dynamically computed based on {pet.name}'s breed, weight ({pet.weightKg} kg), and temperament ({pet.temperament}).
        </p>
      </div>

      {/* Dynamic Duration Alert / Explainer Box */}
      {dynamicBreakdown && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span>Dynamic Duration Calculation for {pet.name}</span>
            </span>
            <span className="text-sm font-bold font-mono text-teal-900 bg-white px-2.5 py-0.5 rounded border border-teal-200 shadow-2xs">
              Total: {formatDurationHuman(dynamicBreakdown.totalDurationMinutes)} ({dynamicBreakdown.totalDurationMinutes} mins)
            </span>
          </div>

          <div className="text-xs text-teal-900/90 space-y-1">
            <div className="flex items-center justify-between font-medium">
              <span>Base service duration:</span>
              <span className="font-mono">{dynamicBreakdown.baseDurationMinutes} mins</span>
            </div>
            {dynamicBreakdown.adjustments.map((adj, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] text-teal-800">
                <span>• {adj.label} ({adj.reason})</span>
                <span className="font-mono font-semibold">+{adj.minutes} mins</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services
          .filter((s) => s.suitableFor.includes(pet.species))
          .map((service) => {
            const isSelected = activeServiceId === service.id;
            const breakdown = calculateAppointmentDuration(service, pet);

            return (
              <div
                key={service.id}
                onClick={() => setActiveServiceId(service.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-700 bg-teal-50/50 shadow-xs ring-1 ring-teal-700'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      {service.popular && (
                        <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-0.5">
                          ★ Studio Favorite
                        </span>
                      )}
                      <h4 className="text-sm font-bold text-slate-900">{service.name}</h4>
                    </div>
                    <span className="text-sm font-bold font-mono text-slate-900 tabular-nums shrink-0">
                      ₹{service.priceInr.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-1 text-xs text-slate-700 pt-2 border-t border-slate-100">
                    {service.inclusions.slice(0, 3).map((inc, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px]">
                        <Check className="w-3 h-3 text-teal-600 shrink-0" />
                        <span className="truncate">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-teal-700" />
                    <span>Calculated: {formatDurationHuman(breakdown.totalDurationMinutes)}</span>
                  </div>
                  <span className={`font-semibold text-xs ${isSelected ? 'text-teal-800' : 'text-slate-400'}`}>
                    {isSelected ? '✓ Selected' : 'Select Package'}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Pet Information
        </button>
        <button
          type="button"
          onClick={handleProceed}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Continue to Booking Preferences</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
