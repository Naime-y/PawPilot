import React, { useState } from 'react';
import { ShieldAlert, Heart, Scissors, Sparkles } from 'lucide-react';

interface SpecialRequirementsStepProps {
  petName: string;
  initialRequirements: string;
  onSave: (requirements: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const COMMON_TAGS = [
  'First time at professional groomer',
  'Senior pet - needs gentle breaks',
  'Sensitive / itchy skin (Hypoallergenic shampoo)',
  'Anxious with high-velocity blow dryer',
  'Paws/nails sensitive to touch',
  'Keep face rounded / Teddy Bear cut',
  'Remove undercoat matting without shaving',
  'Quiet room handling requested',
];

export const SpecialRequirementsStep: React.FC<SpecialRequirementsStepProps> = ({
  petName,
  initialRequirements,
  onSave,
  onNext,
  onBack,
}) => {
  const [notes, setNotes] = useState(initialRequirements || '');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    let updatedTags: string[];
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }
    setSelectedTags(updatedTags);

    // Combine tags with custom notes
    const combined = updatedTags.length > 0
      ? `${updatedTags.join(', ')}. ${notes}`.trim()
      : notes;
    onSave(combined);
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    const combined = selectedTags.length > 0
      ? `${selectedTags.join(', ')}. ${val}`.trim()
      : val;
    onSave(combined);
  };

  const handleProceed = () => {
    const combined = selectedTags.length > 0
      ? `${selectedTags.join(', ')}. ${notes}`.trim()
      : notes;
    onSave(combined);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Special Requirements & Handling Notes for {petName || 'your pet'}
        </h3>
        <p className="text-xs text-slate-500">
          Our Kalyani Nagar boutique operates with zero rushed appointments. Please share any quirks, health conditions, or style expectations so our stylists are thoroughly prepared.
        </p>
      </div>

      {/* Quick Select Badges / Preferences */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Common Handling & Comfort Preferences (Click to add)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMMON_TAGS.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                  active
                    ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{tag}</span>
                <span className="text-xs">{active ? '✓' : '+'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Notes Field */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Detailed Instructions / Specific Grooming Preferences
        </label>
        <textarea
          rows={4}
          placeholder="e.g. Bruno is recovering from a right paw sprain, please do not lift paw too high. For haircut, please trim 1 inch off the coat but keep the head round and fluffy."
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Stylists review all notes before welcoming your pet into the grooming suite.
        </p>
      </div>

      {/* Safety & Protocol Notice */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-600">
        <Heart className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900">Fear-Free Philosophy:</span> We never force an anxious pet. If a pet becomes distressed during styling, our groomers pause, provide sensory decompression, and consult you directly.
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Service Selection
        </button>
        <button
          type="button"
          onClick={handleProceed}
          className="px-5 py-2.5 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 transition-colors shadow-xs"
        >
          Continue to Schedule Availability →
        </button>
      </div>
    </div>
  );
};
