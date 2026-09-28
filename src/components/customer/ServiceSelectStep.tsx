import React from 'react';
import { Service, PetSpecies } from '../../types';
import { Clock, Check, Sparkles } from 'lucide-react';

interface ServiceSelectStepProps {
  services: Service[];
  selectedServiceId: string;
  petSpecies: PetSpecies;
  petName: string;
  onSelect: (serviceId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ServiceSelectStep: React.FC<ServiceSelectStepProps> = ({
  services,
  selectedServiceId,
  petSpecies,
  petName,
  onSelect,
  onNext,
  onBack,
}) => {
  const filteredServices = services.filter((s) => s.suitableFor.includes(petSpecies));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Choose a tailored grooming experience for {petName || 'your pet'}
        </h3>
        <p className="text-xs text-slate-500">
          Showing personalized packages suitable for {petSpecies === 'dog' ? 'dogs' : 'cats'}. All sessions include a pre-groom skin & coat evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <div
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={`relative p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-700 bg-teal-50/50 shadow-xs ring-1 ring-teal-700'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    {service.popular && (
                      <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block mb-1">
                        ★ Most Popular Choice
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {service.title}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                      ₹{service.priceInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                  <Clock className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span>{service.durationMinutes} minutes duration</span>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block">Package Includes:</span>
                  {service.inclusions.slice(0, 4).map((inc, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-3 h-3 text-teal-600 shrink-0" />
                      <span className="truncate">{inc}</span>
                    </div>
                  ))}
                  {service.inclusions.length > 4 && (
                    <p className="text-[11px] text-teal-700 font-medium pl-5">
                      +{service.inclusions.length - 4} more inclusions
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {isSelected ? 'Selected' : 'Click to select'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(service.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-teal-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? '✓ Selected' : 'Choose Package'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Pet Information
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedServiceId}
          className="px-5 py-2.5 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          Continue to Special Requirements →
        </button>
      </div>
    </div>
  );
};
