import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, Pet } from '../../types';
import { Search, Plus, User, Heart, Phone, Mail, MapPin, Calendar, Sparkles } from 'lucide-react';

export const CustomersPetsView: React.FC = () => {
  const { customers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((cust) => {
    const query = searchTerm.toLowerCase();
    const matchName = cust.fullName.toLowerCase().includes(query);
    const matchPhone = cust.phone.includes(query);
    const matchPet = cust.pets.some(
      (p) => p.name.toLowerCase().includes(query) || p.breed.toLowerCase().includes(query)
    );
    return matchName || matchPhone || matchPet;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Clients & Pet Directory</h2>
          <p className="text-xs text-slate-500">
            Registered pet parents, companion profiles, breed notes, and grooming history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search client, pet name, breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-teal-700 w-56 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer List */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Client Accounts ({filteredCustomers.length})
          </span>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredCustomers.map((cust) => {
              const isSelected = selectedCustomer?.id === cust.id;
              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-700 bg-teal-50/60 shadow-xs ring-1 ring-teal-700'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{cust.fullName}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{cust.phone}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                      {cust.totalVisits} {cust.totalVisits === 1 ? 'visit' : 'visits'}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span>🐾 Pets:</span>
                    <span className="font-medium text-slate-800">
                      {cust.pets.map((p) => `${p.name} (${p.breed})`).join(', ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer & Pet Detailed Profile */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              {/* Client Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCustomer.fullName}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-teal-700" />
                      {selectedCustomer.phone}
                    </span>
                    {selectedCustomer.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-teal-700" />
                        {selectedCustomer.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500">Member Since:</span>
                  <p className="text-xs font-mono font-medium text-slate-800">
                    {selectedCustomer.createdAt}
                  </p>
                </div>
              </div>

              {selectedCustomer.address && (
                <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span>{selectedCustomer.address}</span>
                </div>
              )}

              {/* Pets Profiles */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Registered Pets ({selectedCustomer.pets.length})
                </h4>

                <div className="space-y-4">
                  {selectedCustomer.pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{pet.species === 'dog' ? '🐕' : '🐈'}</span>
                          <div>
                            <span className="font-bold text-sm text-slate-900">{pet.name}</span>
                            <span className="text-xs text-slate-500 ml-2">
                              {pet.breed} · {pet.size.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {pet.ageYears && (
                          <span className="text-xs font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {pet.ageYears} yrs old
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200 text-slate-600">
                        <div>
                          <span className="text-slate-400 block">Weight</span>
                          <span className="font-medium text-slate-800 font-mono">
                            {pet.weightKg ? `${pet.weightKg} kg` : 'Not recorded'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Coat Texture</span>
                          <span className="font-medium text-slate-800">
                            {pet.coatType || 'Standard'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Care Category</span>
                          <span className="font-medium text-slate-800">
                            {pet.species === 'cat' ? 'Quiet Room Feline' : 'Canine Suite'}
                          </span>
                        </div>
                      </div>

                      {pet.specialNotes && (
                        <div className="text-xs bg-amber-50/80 border border-amber-200 p-2.5 rounded-lg text-amber-900">
                          <span className="font-semibold">Special Grooming & Handling Quirks:</span>{' '}
                          {pet.specialNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <User className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Select a client on the left to inspect their pet profiles and visit history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
