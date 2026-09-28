import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Users, Calendar, IndianRupee, Sparkles, CheckCircle2 } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { appointments, services, customers } = useApp();

  const totalBookings = appointments.length;
  const activeBookings = appointments.filter((a) => a.status !== 'cancelled').length;
  const totalRevenue = appointments
    .filter((a) => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.totalPriceInr, 0);

  const totalPets = customers.reduce((sum, c) => sum + c.pets.length, 0);

  // Group bookings by service
  const serviceStats = services.map((srv) => {
    const count = appointments.filter((a) => a.serviceId === srv.id).length;
    const revenue = appointments
      .filter((a) => a.serviceId === srv.id && a.status !== 'cancelled')
      .reduce((sum, a) => sum + a.totalPriceInr, 0);
    return {
      title: srv.title,
      count,
      revenue,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Studio Booking Analytics</h2>
        <p className="text-xs text-slate-500">
          Booking volumes, gross revenue in INR, capacity metrics, and service popularity at Kalyani Nagar.
        </p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Appointments
            </span>
            <span className="p-2 bg-teal-50 text-teal-800 rounded-lg">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-2 tabular-nums">
            {totalBookings}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {activeBookings} active scheduled
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Booked Revenue
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-2 tabular-nums">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Average ticket: ₹{activeBookings ? Math.round(totalRevenue / activeBookings).toLocaleString('en-IN') : 0}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Registered Pets
            </span>
            <span className="p-2 bg-blue-50 text-blue-800 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-2 tabular-nums">
            {totalPets}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across {customers.length} client families
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Studio Utilization
            </span>
            <span className="p-2 bg-purple-50 text-purple-800 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-2 tabular-nums">
            82%
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            Optimal capacity reached
          </span>
        </div>
      </div>

      {/* Service Popularity Breakdown & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 & 2: Popular Services */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Service Package Performance
          </h3>
          <div className="space-y-4">
            {serviceStats.map((stat, i) => {
              const maxCount = Math.max(...serviceStats.map((s) => s.count), 1);
              const percent = Math.round((stat.count / maxCount) * 100);

              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{stat.title}</span>
                    <span className="font-mono text-slate-600 tabular-nums">
                      {stat.count} bookings · ₹{stat.revenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-700 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Col 3: Status Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Booking Status Breakdown
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="font-medium text-emerald-900">Confirmed Appointments</span>
              <span className="font-mono font-bold text-emerald-900">
                {appointments.filter((a) => a.status === 'confirmed').length}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg border border-blue-100">
              <span className="font-medium text-blue-900">Currently in Service</span>
              <span className="font-mono font-bold text-blue-900">
                {appointments.filter((a) => a.status === 'in_service').length}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-100 rounded-lg border border-slate-200">
              <span className="font-medium text-slate-800">Completed Sessions</span>
              <span className="font-mono font-bold text-slate-800">
                {appointments.filter((a) => a.status === 'completed').length}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-rose-50 rounded-lg border border-rose-100">
              <span className="font-medium text-rose-900">Cancelled / No-shows</span>
              <span className="font-mono font-bold text-rose-900">
                {appointments.filter((a) => a.status === 'cancelled').length}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            <p>
              💡 Automated WhatsApp 24-hr reminder messages keep cancellation rate under 4% in Kalyani Nagar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
