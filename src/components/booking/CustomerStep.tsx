import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Customer } from '../../types/booking';
import { User, Phone, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

interface CustomerStepProps {
  onCustomerReady: (customer: Customer) => void;
}

export const CustomerStep: React.FC<CustomerStepProps> = ({ onCustomerReady }) => {
  const { currentUser, userProfile, signInWithGoogle } = useAuth();

  const [fullName, setFullName] = useState(userProfile?.displayName || currentUser?.displayName || 'Alex');
  const [phone, setPhone] = useState(userProfile?.phoneNumber || '+91 98220 12345');
  const [email, setEmail] = useState(userProfile?.email || currentUser?.email || 'alex.petparent@gmail.com');
  const [address, setAddress] = useState('Lane 7, Kalyani Nagar, Pune');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const customerData: Customer = {
      id: currentUser?.uid || `cust_${Date.now()}`,
      fullName,
      phone,
      email,
      address,
      businessId: 'paw-and-polish-pune',
      createdAt: new Date().toISOString(),
      totalVisits: 1,
    };

    onCustomerReady(customerData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Pet Parent Identification</h3>
        <p className="text-xs text-slate-500 mt-1">
          Your contact details are linked to your appointment for WhatsApp status updates and concierge communications at Paw & Polish, Kalyani Nagar.
        </p>
      </div>

      {!currentUser && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-teal-950 block">Signed in as Guest Demo</span>
            <p className="text-[11px] text-teal-800 mt-0.5">
              Sign in with your Google account to automatically remember your pets across visits.
            </p>
          </div>
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="px-3.5 py-1.5 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 transition-colors shrink-0"
          >
            Google Sign-In
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. Alex"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Number (WhatsApp) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="tel"
                required
                placeholder="+91 98220 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Neighborhood / Area (Pune)
            </label>
            <input
              type="text"
              placeholder="e.g. Kalyani Nagar, Viman Nagar, Koregaon Park"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 bg-white"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Continue to Pet Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
