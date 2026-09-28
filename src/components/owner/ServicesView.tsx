import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service, ServiceCategory, PetSpecies } from '../../types';
import { Plus, Clock, Edit2, Check, Sparkles, X } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { services, addService, updateService } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form state for add / edit
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('full_groom');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [priceInr, setPriceInr] = useState(1500);
  const [suitableDogs, setSuitableDogs] = useState(true);
  const [suitableCats, setSuitableCats] = useState(false);
  const [inclusionsText, setInclusionsText] = useState('Organic bath\nScissor styling\nNail trim\nEar cleansing');

  const openAddModal = () => {
    setEditingService(null);
    setTitle('');
    setCategory('full_groom');
    setDescription('');
    setDurationMinutes(60);
    setPriceInr(1500);
    setSuitableDogs(true);
    setSuitableCats(false);
    setInclusionsText('Organic bath\nScissor styling\nNail trim\nEar cleansing');
    setModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setTitle(s.title);
    setCategory(s.category);
    setDescription(s.description);
    setDurationMinutes(s.durationMinutes);
    setPriceInr(s.priceInr);
    setSuitableDogs(s.suitableFor.includes('dog'));
    setSuitableCats(s.suitableFor.includes('cat'));
    setInclusionsText(s.inclusions.join('\n'));
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || priceInr <= 0) return;

    const suitableFor: ('dog' | 'cat')[] = [];
    if (suitableDogs) suitableFor.push('dog');
    if (suitableCats) suitableFor.push('cat');
    if (suitableFor.length === 0) suitableFor.push('dog');

    const inclusions = inclusionsText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingService) {
      updateService({
        ...editingService,
        title,
        category,
        description,
        durationMinutes,
        priceInr,
        suitableFor,
        inclusions,
      });
    } else {
      addService({
        title,
        category,
        description,
        durationMinutes,
        priceInr,
        suitableFor,
        inclusions,
        popular: false,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Services & Pricing Catalog</h2>
          <p className="text-xs text-slate-500">
            Configure boutique grooming packages, duration allowances, inclusions, and INR pricing.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Service Package</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-sm text-slate-900">{service.title}</h3>
                <span className="font-mono font-bold text-slate-900 text-base tabular-nums shrink-0">
                  ₹{service.priceInr.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-700" />
                  {service.durationMinutes} mins
                </span>
                <span>·</span>
                <span className="text-slate-600 font-medium">
                  {service.suitableFor.map((s) => (s === 'dog' ? 'Canine' : 'Feline')).join(' & ')}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-3">
                {service.description}
              </p>

              <div className="pt-3 border-t border-slate-100 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  Inclusions ({service.inclusions.length})
                </span>
                {service.inclusions.slice(0, 3).map((inc, i) => (
                  <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-teal-600 shrink-0" />
                    <span className="truncate">{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 capitalize">
                Category: {service.category.replace('_', ' ')}
              </span>
              <button
                onClick={() => openEditModal(service)}
                className="px-2.5 py-1 text-xs text-teal-800 hover:bg-teal-50 rounded font-medium flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingService ? 'Edit Grooming Package' : 'Create New Service Package'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medicated Herbal De-tick Spa"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price in INR (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="50"
                    value={priceInr}
                    onChange={(e) => setPriceInr(parseInt(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline what makes this service unique..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Suitable For
                </label>
                <div className="flex gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={suitableDogs}
                      onChange={(e) => setSuitableDogs(e.target.checked)}
                      className="rounded text-teal-700"
                    />
                    <span>Dogs (Canine)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={suitableCats}
                      onChange={(e) => setSuitableCats(e.target.checked)}
                      className="rounded text-teal-700"
                    />
                    <span>Cats (Feline)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Package Inclusions (One per line)
                </label>
                <textarea
                  rows={3}
                  value={inclusionsText}
                  onChange={(e) => setInclusionsText(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 transition-colors"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
