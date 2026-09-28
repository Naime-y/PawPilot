import React, { useState, useEffect } from 'react';
import { Pet, GroomingService, DurationBreakdown, BookingPreferences, StaffMember } from '../../types/booking';
import { availabilityService, ProposedSlot } from '../../services/availabilityService';
import { formatDurationHuman } from '../../services/durationService';
import { Calendar, Clock, User, Sparkles, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AvailabilityStepProps {
  pet: Pet;
  service: GroomingService;
  breakdown: DurationBreakdown;
  preferences: BookingPreferences;
  selectedSlot: ProposedSlot | null;
  onSlotSelected: (slot: ProposedSlot) => void;
  onBack: () => void;
}

export const AvailabilityStep: React.FC<AvailabilityStepProps> = ({
  pet,
  service,
  breakdown,
  preferences,
  selectedSlot,
  onSlotSelected,
  onBack,
}) => {
  const [slots, setSlots] = useState<ProposedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [chosenSlotId, setChosenSlotId] = useState<string>(selectedSlot?.slotId || 'slot_1');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await availabilityService.evaluateProspectiveSlots(
        preferences.preferredDate,
        breakdown.totalDurationMinutes,
        pet.temperament,
        preferences.timeOfDay
      );
      setSlots(res.proposedSlots);
      if (!selectedSlot && res.proposedSlots.length > 0) {
        setChosenSlotId(res.proposedSlots[0].slotId);
      }
      setLoading(false);
    }
    load();
  }, [preferences.preferredDate, breakdown.totalDurationMinutes, pet.temperament, preferences.timeOfDay]);

  const activeSlot = slots.find((s) => s.slotId === chosenSlotId) || slots[0];

  const handleProceed = () => {
    if (activeSlot) {
      onSlotSelected(activeSlot);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Studio Availability Foundation
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Based on {pet.name}'s calculated {formatDurationHuman(breakdown.totalDurationMinutes)} window, here are the prospective appointment slots at Paw & Polish, Kalyani Nagar.
        </p>
      </div>

      {/* Honest Availability Engine Notice */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-900">
        <div className="flex items-center gap-2 font-bold">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Availability Engine Foundation Active</span>
        </div>
        <p className="text-amber-800 leading-relaxed text-[11px]">
          PawPilot does not generate fake random slots. Slots displayed below are prospective candidate windows evaluated for {pet.name}'s duration ({breakdown.totalDurationMinutes} mins). When submitted, your booking will be recorded as <span className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded text-amber-950">status: "requested"</span> for salon confirmation in the upcoming concurrency engine.
        </p>
      </div>

      {/* Prospective Slots List */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-700">
          Recommended & Available Grooming Windows for {preferences.preferredDate}:
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {slots.map((slot) => {
            const isSelected = chosenSlotId === slot.slotId;
            const isRecommended = slot.availabilityStatus === 'recommended';

            return (
              <div
                key={slot.slotId}
                onClick={() => setChosenSlotId(slot.slotId)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-700 bg-teal-50/60 ring-1 ring-teal-700 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {slot.startTime}
                    </span>
                    {isRecommended && (
                      <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider bg-teal-100 px-2 py-0.5 rounded">
                        ★ Recommended
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <User className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span className="font-semibold">{slot.assignedStaff.name}</span>
                      <span className="text-[11px] text-slate-500">({slot.assignedStaff.role})</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDurationHuman(slot.estimatedDurationMinutes)} allocated</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-teal-900/80 mt-2.5 pt-2 border-t border-slate-100 leading-snug">
                    {slot.recommendationReason}
                  </p>
                </div>

                <div className="mt-4 pt-2 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {isSelected ? 'Selected Window' : 'Click to select'}
                  </span>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-teal-800' : 'text-slate-500'}`}>
                    {isSelected ? '✓ Selected' : 'Choose'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Preferences
        </button>
        <button
          type="button"
          onClick={handleProceed}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Continue to Final Review</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
