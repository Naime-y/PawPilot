import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Pet, PetSpecies, PetTemperament } from '../../types/booking';
import { getCustomerPets, saveCustomerPet } from '../../services/petService';
import { Heart, Sparkles, AlertCircle, Plus, Check, ArrowRight } from 'lucide-react';

interface PetStepProps {
  onPetSelected: (pet: Pet) => void;
  onBack: () => void;
}

export const PetStep: React.FC<PetStepProps> = ({ onPetSelected, onBack }) => {
  const { currentUser } = useAuth();
  const ownerUid = currentUser?.uid || 'demo_user_alex';

  const [savedPets, setSavedPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form Fields (Preset to Bruno the Golden Retriever demo scenario)
  const [name, setName] = useState('Bruno');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('Golden Retriever');
  const [weightKg, setWeightKg] = useState<number>(28);
  const [temperament, setTemperament] = useState<PetTemperament>('anxious');
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [ageYears, setAgeYears] = useState<number | undefined>(3);
  const [specialRequirements, setSpecialRequirements] = useState(
    'Sensitive to loud high-velocity blow dryer around ears; needs gentle sensory breaks.'
  );

  useEffect(() => {
    async function load() {
      if (ownerUid) {
        setLoadingPets(true);
        const pets = await getCustomerPets(ownerUid);
        setSavedPets(pets);
        setLoadingPets(false);
      }
    }
    load();
  }, [ownerUid]);

  const handleSelectExisting = (pet: Pet) => {
    onPetSelected(pet);
  };

  const handleSaveAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !breed.trim() || !weightKg) return;

    const saved = await saveCustomerPet(ownerUid, {
      name: name.trim(),
      species,
      breed: breed.trim(),
      weightKg: Number(weightKg),
      temperament,
      isFirstVisit,
      ageYears: ageYears ? Number(ageYears) : undefined,
      specialRequirements: specialRequirements.trim(),
    });

    onPetSelected(saved);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Pet Information & Temperament</h3>
        <p className="text-xs text-slate-500 mt-1">
          Tell us about your companion. Weight, temperament, and visit history allow us to calculate exact grooming duration and allocate Fear-Free breaks.
        </p>
      </div>

      {/* Existing Saved Pets Selector */}
      {savedPets.length > 0 && !isAddingNew && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Select One of Your Pets:</span>
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="text-xs text-teal-800 font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Another Pet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedPets.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectExisting(p)}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-700 hover:bg-teal-50/40 cursor-pointer transition-all space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{p.name}</span>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                    {p.weightKg} kg
                  </span>
                </div>
                <p className="text-xs text-slate-500">{p.breed} · {p.species === 'dog' ? 'Dog' : 'Cat'}</p>
                <div className="flex items-center gap-2 text-[11px] text-teal-800 font-medium pt-1">
                  <span className="capitalize">Temperament: {p.temperament}</span>
                  <span>·</span>
                  <span>{p.isFirstVisit ? 'First Visit' : 'Returning Client'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pet Registration Form */}
      {(savedPets.length === 0 || isAddingNew) && (
        <form onSubmit={handleSaveAndContinue} className="space-y-5">
          {savedPets.length > 0 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-xs text-slate-500 hover:underline"
              >
                ← Back to Saved Pets
              </button>
            </div>
          )}

          {/* Species */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Species</label>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              <button
                type="button"
                onClick={() => setSpecies('dog')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  species === 'dog'
                    ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span>🐕</span>
                <span>Dog / Canine</span>
              </button>
              <button
                type="button"
                onClick={() => setSpecies('cat')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  species === 'cat'
                    ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span>🐈</span>
                <span>Cat / Feline</span>
              </button>
            </div>
          </div>

          {/* Name & Breed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pet Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bruno"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Breed <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Golden Retriever"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
              />
            </div>
          </div>

          {/* Weight & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Approximate Weight (kg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0.5"
                max="100"
                step="0.5"
                placeholder="e.g. 28"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {weightKg >= 25 ? 'Large Breed (≥25 kg adds +30 mins care)' : weightKg >= 15 ? 'Medium Breed (15-24 kg adds +15 mins care)' : 'Small Breed (<15 kg)'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age in Years (Optional)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                step="0.5"
                placeholder="e.g. 3"
                value={ageYears || ''}
                onChange={(e) => setAgeYears(parseFloat(e.target.value) || undefined)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white font-mono"
              />
            </div>
          </div>

          {/* Temperament Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pet Temperament & Salon Disposition <span className="text-rose-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Paw & Polish is a Fear-Free studio. Anxious pets receive dedicated calming sensory buffers.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'calm', label: 'Calm', desc: 'Relaxed with baths & drying' },
                { id: 'friendly', label: 'Friendly', desc: 'High energy & playful' },
                { id: 'nervous', label: 'Nervous', desc: 'Slight hesitation (+15m)' },
                { id: 'anxious', label: 'Anxious', desc: 'Sensitive / fearful (+30m)' },
                { id: 'reactive', label: 'Reactive', desc: 'Needs quiet space (+30m)' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTemperament(t.id as PetTemperament)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    temperament === t.id
                      ? 'border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold capitalize">{t.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* First Visit Toggle */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Is this {name || 'your pet'}'s first visit to Paw & Polish?
              </span>
              <p className="text-[11px] text-slate-500">
                Adds a complimentary 15-minute gentle salon familiarization and positive reinforcement session.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFirstVisit}
                onChange={(e) => setIsFirstVisit(e.target.checked)}
                className="w-4 h-4 text-teal-800 rounded focus:ring-teal-700"
              />
              <span className="text-xs font-semibold text-slate-800">First Visit (+15m)</span>
            </label>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Special Requirements & Handling Instructions (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Sensitive left ear, needs hypoallergenic oatmeal shampoo, no loud cage dryers"
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              ← Back to Customer Info
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Continue to Grooming Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
