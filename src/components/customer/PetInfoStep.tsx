import React from 'react';
import { PetSpecies, PetSize } from '../../types';

export interface PetFormData {
  name: string;
  species: PetSpecies;
  breed: string;
  size: PetSize;
  weightKg?: number;
  ageYears?: number;
  coatType?: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
}

interface PetInfoStepProps {
  data: PetFormData;
  onChange: (fields: Partial<PetFormData>) => void;
  onNext: () => void;
}

const COMMON_BREEDS_DOG = [
  'Golden Retriever',
  'Shih Tzu',
  'Indie / Desi Dog',
  'Labrador Retriever',
  'Beagle',
  'Pomeranian / Spitz',
  'Cocker Spaniel',
  'German Shepherd',
];

const COMMON_BREEDS_CAT = [
  'Persian Longhair',
  'Indie / Indian Domestic Cat',
  'British Shorthair',
  'Siamese',
  'Maine Coon',
  'Bengal',
];

export const PetInfoStep: React.FC<PetInfoStepProps> = ({ data, onChange, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name || !data.breed || !data.ownerName || !data.ownerPhone) {
      return;
    }
    onNext();
  };

  const currentBreeds = data.species === 'dog' ? COMMON_BREEDS_DOG : COMMON_BREEDS_CAT;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pet Basic Identity */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Tell us about your furry companion
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Personalized styling and safety begin with understanding your pet's breed and size.
        </p>

        {/* Species Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-2">Pet Type</label>
          <div className="grid grid-cols-2 gap-3 max-w-xs">
            <button
              type="button"
              onClick={() => onChange({ species: 'dog', breed: '' })}
              className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                data.species === 'dog'
                  ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="text-base">🐕</span>
              <span>Dog / Canine</span>
            </button>
            <button
              type="button"
              onClick={() => onChange({ species: 'cat', breed: '' })}
              className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                data.species === 'cat'
                  ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="text-base">🐈</span>
              <span>Cat / Feline</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pet Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bruno, Simba, Mochi"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Breed <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Golden Retriever, Indie, Persian"
              value={data.breed}
              onChange={(e) => onChange({ breed: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {currentBreeds.slice(0, 4).map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => onChange({ breed: b })}
                  className="text-[11px] text-slate-500 hover:text-teal-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Size & Weight */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Pet Size Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'small', label: 'Small', desc: 'Up to 10 kg (Shih Tzu, Indie pup)' },
            { id: 'medium', label: 'Medium', desc: '10–25 kg (Beagle, Cocker Spaniel)' },
            { id: 'large', label: 'Large', desc: '25–45 kg (Golden, Labrador, Indie)' },
            { id: 'giant', label: 'Giant', desc: '45+ kg (Great Dane, St. Bernard)' },
          ].map((sizeOpt) => (
            <button
              type="button"
              key={sizeOpt.id}
              onClick={() => onChange({ size: sizeOpt.id as PetSize })}
              className={`p-3 rounded-lg border text-left transition-all ${
                data.size === sizeOpt.id
                  ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-bold">{sizeOpt.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{sizeOpt.desc}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Approx. Age (Years)</label>
            <input
              type="number"
              min="0"
              max="25"
              step="0.5"
              placeholder="e.g. 2.5"
              value={data.ageYears || ''}
              onChange={(e) => onChange({ ageYears: parseFloat(e.target.value) || undefined })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Weight in kg (Optional)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              placeholder="e.g. 14"
              value={data.weightKg || ''}
              onChange={(e) => onChange({ weightKg: parseFloat(e.target.value) || undefined })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Coat Texture</label>
            <select
              value={data.coatType || ''}
              onChange={(e) => onChange({ coatType: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
            >
              <option value="">Select coat type</option>
              <option value="Short & Smooth">Short & Smooth</option>
              <option value="Double Coat / Dense Undercoat">Double Coat / Dense Undercoat</option>
              <option value="Long & Silky">Long & Silky</option>
              <option value="Curly / Wavy / Poodle texture">Curly / Wavy / Poodle texture</option>
              <option value="Wire / Harsh">Wire / Harsh</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pet Parent Contact */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Pet Parent Contact Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Priya Iyer"
              value={data.ownerName}
              onChange={(e) => onChange({ ownerName: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Number (WhatsApp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98230 00000"
              value={data.ownerPhone}
              onChange={(e) => onChange({ ownerPhone: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@domain.com"
              value={data.ownerEmail}
              onChange={(e) => onChange({ ownerEmail: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!data.name || !data.breed || !data.ownerName || !data.ownerPhone}
          className="px-5 py-2.5 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          Continue to Grooming Services →
        </button>
      </div>
    </form>
  );
};
