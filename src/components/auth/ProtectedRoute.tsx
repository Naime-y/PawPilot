import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { ShieldAlert, LogIn, AlertCircle, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  fallbackRoute?: string;
  onNavigateHome?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
  onNavigateHome,
}) => {
  const { currentUser, userProfile, loading, signInWithGoogle } = useAuth();

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-8 h-8 border-3 border-teal-700 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-600">Verifying studio session & security credentials...</p>
        <p className="text-[11px] text-slate-400 mt-1">PawPilot Zero-Trust Authorization</p>
      </div>
    );
  }

  // 2. Unauthenticated User State
  if (requireAuth && !currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
          <LogIn className="w-6 h-6 text-amber-700" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Authentication Required</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Please sign in with your Google account to access this area of PawPilot.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => signInWithGoogle()}
            className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Sign In with Google
          </button>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. Unauthorized / Role Mismatch State
  if (allowedRoles && allowedRoles.length > 0) {
    const currentRole = userProfile?.role || 'customer';
    const isAllowed = allowedRoles.includes(currentRole);

    if (!isAllowed) {
      return (
        <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-rose-200 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-800 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6 text-rose-700" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold text-rose-700 uppercase tracking-wider">
              Access Denied (403 Forbidden)
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Insufficient Permissions
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your account is currently identified as <span className="font-semibold text-slate-800 capitalize">"{currentRole}"</span>. This administrative area is restricted to{' '}
              <span className="font-semibold text-slate-800">
                {allowedRoles.map((r) => `"${r}"`).join(' or ')}
              </span>{' '}
              personnel of Paw & Polish.
            </p>
          </div>
          {onNavigateHome && (
            <div className="pt-2">
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Customer Booking</span>
              </button>
            </div>
          )}
        </div>
      );
    }
  }

  // 4. Authorized Access
  return <>{children}</>;
};
