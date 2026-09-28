import React from 'react';
import { useApp, OwnerTab } from '../../context/AppContext';
import { AppointmentsView } from './AppointmentsView';
import { CustomersPetsView } from './CustomersPetsView';
import { StaffView } from './StaffView';
import { ServicesView } from './ServicesView';
import { InquiriesView } from './InquiriesView';
import { RemindersView } from './RemindersView';
import { AnalyticsView } from './AnalyticsView';
import {
  Calendar,
  Users,
  Scissors,
  Layers,
  MessageSquare,
  Bell,
  BarChart3,
  MapPin,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  id: OwnerTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const OwnerDashboard: React.FC = () => {
  const {
    business,
    ownerActiveTab,
    setOwnerActiveTab,
    appointments,
    inquiries,
    setCurrentView,
  } = useApp();

  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;
  const todayAptsCount = appointments.filter((a) => a.status === 'confirmed' || a.status === 'in_service').length;

  const navItems: NavItem[] = [
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: todayAptsCount },
    { id: 'customers', label: 'Customers & Pets', icon: Users },
    { id: 'staff', label: 'Staff & Stylists', icon: Scissors },
    { id: 'services', label: 'Services Catalog', icon: Layers },
    { id: 'inquiries', label: 'Customer Inquiries', icon: MessageSquare, badge: newInquiriesCount > 0 ? newInquiriesCount : undefined },
    { id: 'reminders', label: 'Automated Reminders', icon: Bell },
    { id: 'analytics', label: 'Booking Analytics', icon: BarChart3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Studio Banner / Breadcrumb Top Area */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-800">PawPilot Studio</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">{business.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-teal-800 font-semibold capitalize">
            {ownerActiveTab.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-700" />
            {business.neighborhood}, {business.city}
          </span>
          <span>·</span>
          <button
            onClick={() => setCurrentView('customer')}
            className="text-teal-800 hover:underline font-semibold flex items-center gap-1"
          >
            <span>Live Booking Portal</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Studio Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = ownerActiveTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setOwnerActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-200' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100 px-3 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-600">{business.name}</p>
            <p>Pune Studio #104</p>
          </div>
        </aside>

        {/* Active Viewport */}
        <main className="lg:col-span-3">
          {ownerActiveTab === 'appointments' && <AppointmentsView />}
          {ownerActiveTab === 'customers' && <CustomersPetsView />}
          {ownerActiveTab === 'staff' && <StaffView />}
          {ownerActiveTab === 'services' && <ServicesView />}
          {ownerActiveTab === 'inquiries' && <InquiriesView />}
          {ownerActiveTab === 'reminders' && <RemindersView />}
          {ownerActiveTab === 'analytics' && <AnalyticsView />}
        </main>
      </div>
    </div>
  );
};
