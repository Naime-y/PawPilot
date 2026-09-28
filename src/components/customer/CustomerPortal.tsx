import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { BookingFlowContainer } from '../booking/BookingFlowContainer';
import { BookingForm } from './BookingForm';
import {
  MapPin,
  Clock,
  Sparkles,
  Shield,
  CheckCircle,
  Search,
  LogIn,
  Scissors,
  ArrowRight,
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const { business, setManageBookingModalOpen } = useApp();
  const { currentUser, signInWithGoogle } = useAuth();

  // Quick inquiry state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryPet, setInquiryPet] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone || !inquiryMsg) return;
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquiryName('');
      setInquiryPhone('');
      setInquiryPet('');
      setInquiryMsg('');
    }, 1000);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Studio Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="/src/assets/images/hero_grooming_studio_1790582607711.jpg"
            alt="Paw & Polish Boutique Salon Interior"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl px-6 sm:px-10 py-12 sm:py-16 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-teal-400 font-semibold tracking-wider uppercase">
              Boutique Pet Grooming Studio
            </span>
            <span className="text-slate-500">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              {business.neighborhood}, {business.city}, Maharashtra
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stress-free styling & spa care for your companion.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Welcome to <span className="text-white font-semibold">{business.name}</span>. We provide calm, cage-free, personalized one-on-one grooming sessions using organic botanical therapies in Kalyani Nagar.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('customer-booking-journey-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Start Customer Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setManageBookingModalOpen(true)}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl backdrop-blur-xs transition-all border border-white/20 flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Reschedule or Cancel Booking</span>
            </button>
          </div>

          {/* Studio Trust Markers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-400 shrink-0" />
              <span>100% Fear-Free Protocol</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Organic Oatmeal & Aloe Spas</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Prompt Slots · No Cage Waiting</span>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Banner if not signed in */}
      {!currentUser && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-teal-50/80 border border-teal-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-800 text-white flex items-center justify-center shrink-0">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-teal-950">
                  Sign in with Google for Instant Pet Profile Sync
                </h4>
                <p className="text-xs text-teal-800/80 mt-0.5">
                  Save your pet's breed and grooming preferences across visits, view appointments, and receive real-time updates.
                </p>
              </div>
            </div>
            <button
              onClick={() => signInWithGoogle()}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-xs transition-colors shrink-0"
            >
              Sign In with Google
            </button>
          </div>
        </section>
      )}

      {/* Main Complete Customer Booking Journey Flow */}
      <section id="customer-booking-journey-section" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
            Step 1–6 Online Reservation Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Book an Appointment at Paw & Polish
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
            Experience our dynamic duration calculator (large breed + anxious temperament buffers) and submit a secure reservation request directly to Firestore.
          </p>
        </div>

        {/* Customer Booking Flow Container */}
        <BookingFlowContainer
          onOpenMyBookings={() => setManageBookingModalOpen(true)}
          onFinish={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </section>

      {/* Quick Express Form Modal Anchor */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-slate-600">
            <Scissors className="w-4 h-4 text-teal-700" />
            <span>Need a quick package preview? Use our instant catalog selector.</span>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('express-booking-drawer');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs text-teal-800 font-semibold hover:underline"
          >
            View Quick Form ↓
          </button>
        </div>
      </section>

      <section id="express-booking-drawer" className="max-w-5xl mx-auto px-4 sm:px-6">
        <BookingForm />
      </section>

      {/* Meet Our Kalyani Nagar Studio Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Studio Atmosphere
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Gentle hands, soothing music, zero assembly-line stress.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Traditional grooming salons can be noisy and disorienting. At Paw & Polish, we maintain low noise levels, sanitized stainless steel hydro-baths, and ergonomic tables to keep pets relaxed.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Dedicated separate suite for feline grooming</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Senior dog orthopedic support mats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Reserved curbside drop-off parking on Lane 7</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-xs border border-slate-200 aspect-4/3">
            <img
              src="/src/assets/images/stylist_grooming_dog_1790582631486.jpg"
              alt="Stylist gently brushing a dog at Paw & Polish"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Quick Inquiries / Questions Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-teal-900 text-white rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Have Special Questions?
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Consult our Kalyani Nagar Grooming Concierge
              </h3>
              <p className="text-xs sm:text-sm text-teal-100/90 mt-2 leading-relaxed">
                Whether your dog has severe anxiety, chronic skin dermatitis, or needs an urgent pre-travel bath, submit an inquiry and our lead stylist will contact you directly.
              </p>
              <div className="mt-4 pt-4 border-t border-teal-800 text-xs text-teal-200 space-y-1">
                <p>📍 {business.address}, {business.neighborhood}, Pune</p>
                <p>📞 Phone: {business.phone} (Tue - Sun, 9:30 AM - 7 PM)</p>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="bg-white rounded-xl p-5 text-slate-900 shadow-md">
              {inquirySubmitted ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Inquiry Received</h4>
                  <p className="text-xs text-slate-500">
                    Our concierge has logged your inquiry into the PawPilot dashboard and will call you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                    Send Studio Consultation Request
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Number"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Pet Breed & Age (e.g. Beagle, 4 yrs)"
                    value={inquiryPet}
                    onChange={(e) => setInquiryPet(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                  />
                  <textarea
                    rows={2}
                    required
                    placeholder="What would you like to ask our stylists?"
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
                  >
                    Submit Question to Paw & Polish
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
