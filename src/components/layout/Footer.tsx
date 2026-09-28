import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { business } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Studio Identity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐾</span>
              <span className="text-lg font-bold text-white tracking-tight">
                {business.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {business.tagline}. High-trust, low-stress personalized grooming experience for your canine and feline family members.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Fear-Free Groomers</span>
            </div>
          </div>

          {/* Col 2: Studio Location in Pune */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Studio Location
            </h4>
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p>{business.address}</p>
                <p>{business.neighborhood}, {business.city}</p>
                <p>{business.state}, {business.country} - {business.pincode}</p>
              </div>
            </div>
          </div>

          {/* Col 3: Hours & Appointments */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Visiting Hours
            </h4>
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">{business.operatingHours.days}</p>
                <p className="text-slate-400">{business.operatingHours.hours}</p>
                <p className="text-[11px] text-teal-400 mt-1">By prior appointment only</p>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Concierge */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Studio Concierge
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="font-mono text-slate-200">{business.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-slate-200">{business.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PawPilot · Built for {business.name}, Kalyani Nagar, Pune.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Hygiene Protocol Verified</span>
            <span>·</span>
            <span>Organic Shampoos</span>
            <span>·</span>
            <span>Transparent Scheduling</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
