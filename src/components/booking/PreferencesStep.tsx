import React, { useState } from 'react';
import { Pet, GroomingService, BookingPreferences, TimeOfDayPreference } from '../../types/booking';
import { Calendar as CalendarIcon, Clock, Sparkles, ArrowRight } from 'lucide-react';

interface PreferencesStepProps {
  pet: Pet;
  service: GroomingService;
  initialPreferences?: BookingPreferences;
  onPreferencesReady: (preferences: BookingPreferences) => void;
  onBack: () => void;
}

export const PreferencesStep: React.FC<PreferencesStepProps> = ({
  pet,
  service,
  initialPreferences,
  onPreferencesReady,
  onBack,
}) => {
  // Default to tomorrow or Tuesday if Monday closed
  const defaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 1) d.setDate(d.getDate() + 1); // skip Monday
    return d.toISOString().split('T')[0];
  };

  const [preferredDate, setPreferredDate] = useState(
    initialPreferences?.preferredDate || defaultDate()
  );
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayPreference>(
    initialPreferences?.timeOfDay || 'morning'
  );
  const [flexibleDate, setFlexibleDate] = useState<boolean>(
    initialPreferences?.flexibleDate ?? true
  );
  const [specialNotes, setSpecialNotes] = useState(
    initialPreferences?.specialNotes ||
      'Please allow extra time for Bruno to sniff around the table before turning on water.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredDate) return;

    onPreferencesReady({
      preferredDate,
      timeOfDay,
      flexibleDate,
      specialNotes: specialNotes.trim(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Scheduling Preferences & Specific Requests
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Specify your preferred appointment window and any notes. In the next step, our schedule interface presents available time slots matching {pet.name}'s profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Preferred Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Target Appointment Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative max-w-sm">
            <CalendarIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white font-mono"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Studio is open Tuesday through Sunday (9:30 AM – 7:00 PM). Closed on Mondays.
          </span>
        </div>

        {/* Time of Day Preference */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Preferred Time of Day
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'morning', label: 'Morning', desc: '09:30 AM – 12:30 PM (Quietest period)' },
              { id: 'afternoon', label: 'Afternoon', desc: '01:00 PM – 04:30 PM (Midday)' },
              { id: 'evening', label: 'Late Afternoon / Evening', desc: '04:30 PM – 07:00 PM' },
              { id: 'any', label: 'Any Time Slot', desc: 'First available matching slot' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setTimeOfDay(opt.id as TimeOfDayPreference)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  timeOfDay === opt.id
                    ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold capitalize">{opt.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Flexibility Checkbox */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Flexible within ±1 day if preferred slot is booked?
            </span>
            <p className="text-[11px] text-slate-500">
              Helps our stylists arrange the lowest-stress time window with the ideal fear-free specialist.
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={flexibleDate}
              onChange={(e) => setFlexibleDate(e.target.checked)}
              className="w-4 h-4 text-teal-800 rounded focus:ring-teal-700"
            />
            <span className="text-xs font-semibold text-slate-800">Flexible</span>
          </label>
        </div>

        {/* Special Notes & Requests */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Special Notes for Stylist & Salon Intake
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Bruno is sensitive near left ear; please use botanical lavender calm balm."
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Service Selection
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Proceed to Studio Availability Foundation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
