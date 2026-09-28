import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Calendar, Search, LogIn, LogOut, User, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    business,
    currentView,
    setCurrentView,
    setManageBookingModalOpen,
  } = useApp();

  const {
    currentUser,
    userProfile,
    signInWithGoogle,
    logOut,
    loading: authLoading,
  } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🐾
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                PawPilot
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500">
                · {business.name} ({business.neighborhood})
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation & Mode Switcher */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setCurrentView('customer')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                currentView === 'customer'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Customer Booking
            </button>
            <button
              onClick={() => setCurrentView('owner')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                currentView === 'owner'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Studio Dashboard
            </button>
          </div>

          <button
            onClick={() => setManageBookingModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-teal-800 transition-colors whitespace-nowrap hover:bg-slate-50 rounded-md"
            title="Search by Booking Reference or Phone"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Manage My Booking</span>
          </button>
        </nav>

        {/* Zone 3: Authentication & Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Auth State Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 pr-2 py-1 bg-slate-100 rounded-full border border-slate-200/80">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-teal-800 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="hidden sm:block text-left text-[11px] leading-tight pr-1">
                <p className="font-semibold text-slate-800 truncate max-w-[100px]">
                  {currentUser.displayName?.split(' ')[0] || 'User'}
                </p>
                <p className="text-[10px] text-teal-800 font-medium capitalize">
                  {userProfile?.role || 'Customer'}
                </p>
              </div>
              <button
                onClick={() => logOut()}
                title="Sign out"
                className="p-1 text-slate-400 hover:text-rose-600 rounded-full transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              disabled={authLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-800" />
              <span>Google Sign-In</span>
            </button>
          )}

          {currentView === 'owner' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('customer')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-teal-900 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span className="hidden sm:inline">Test Client View</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                const el = document.getElementById('quick-booking-form-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors shadow-xs whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
