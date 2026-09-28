import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BusinessProfile,
  Service,
  StaffMember,
  Customer,
  Appointment,
  Inquiry,
  ReminderRule,
  AppointmentStatus,
  InquiryStatus,
  Pet,
} from '../types';
import {
  BUSINESS_PROFILE,
  INITIAL_SERVICES,
  INITIAL_STAFF,
  INITIAL_CUSTOMERS,
  INITIAL_APPOINTMENTS,
  INITIAL_INQUIRIES,
  INITIAL_REMINDERS,
} from '../data/mockData';

export type AppView = 'customer' | 'owner';
export type OwnerTab =
  | 'appointments'
  | 'customers'
  | 'staff'
  | 'services'
  | 'inquiries'
  | 'reminders'
  | 'analytics';

export interface BookingSubmissionData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pet: Omit<Pet, 'id'>;
  serviceId: string;
  staffId: string;
  date: string;
  timeSlot: string;
  specialRequirements?: string;
}

interface AppContextType {
  business: BusinessProfile;
  services: Service[];
  staff: StaffMember[];
  customers: Customer[];
  appointments: Appointment[];
  inquiries: Inquiry[];
  reminders: ReminderRule[];
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  ownerActiveTab: OwnerTab;
  setOwnerActiveTab: (tab: OwnerTab) => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  createAppointment: (data: BookingSubmissionData) => Appointment;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTimeSlot: string) => boolean;
  cancelAppointment: (appointmentId: string, reason?: string) => boolean;
  findAppointmentByCodeOrPhone: (query: string) => Appointment[];
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  toggleStaffActive: (id: string) => void;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  toggleReminderRule: (id: string) => void;
  updateReminderTemplate: (id: string, template: string) => void;
  manageBookingModalOpen: boolean;
  setManageBookingModalOpen: (open: boolean) => void;
  prefilledBookingCode: string;
  setPrefilledBookingCode: (code: string) => void;
  registerConfirmedBooking: (doc: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business] = useState<BusinessProfile>(BUSINESS_PROFILE);
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('pawpilot_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('pawpilot_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('pawpilot_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('pawpilot_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('pawpilot_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });
  const [reminders, setReminders] = useState<ReminderRule[]>(() => {
    const saved = localStorage.getItem('pawpilot_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [currentView, setCurrentView] = useState<AppView>('customer');
  const [ownerActiveTab, setOwnerActiveTab] = useState<OwnerTab>('appointments');
  const [manageBookingModalOpen, setManageBookingModalOpen] = useState(false);
  const [prefilledBookingCode, setPrefilledBookingCode] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync state to local storage for realistic persistence across tabs/reloads
  useEffect(() => {
    localStorage.setItem('pawpilot_services', JSON.stringify(services));
  }, [services]);
  useEffect(() => {
    localStorage.setItem('pawpilot_staff', JSON.stringify(staff));
  }, [staff]);
  useEffect(() => {
    localStorage.setItem('pawpilot_customers', JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    localStorage.setItem('pawpilot_appointments', JSON.stringify(appointments));
  }, [appointments]);
  useEffect(() => {
    localStorage.setItem('pawpilot_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);
  useEffect(() => {
    localStorage.setItem('pawpilot_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const createAppointment = (data: BookingSubmissionData): Appointment => {
    const selectedService = services.find((s) => s.id === data.serviceId) || services[0];
    const selectedStaff = staff.find((st) => st.id === data.staffId) || staff[0];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const confirmationCode = `PP-${randomSuffix}`;
    const appointmentId = `apt-${Date.now()}`;
    const petId = `pet-${Date.now()}`;

    const newPet: Pet = {
      id: petId,
      ...data.pet,
    };

    // Check if customer exists by phone
    let customerId = `cust-${Date.now()}`;
    const existingCustomerIndex = customers.findIndex(
      (c) => c.phone.replace(/\D/g, '') === data.customerPhone.replace(/\D/g, '')
    );

    if (existingCustomerIndex !== -1) {
      customerId = customers[existingCustomerIndex].id;
      const updatedCustomers = [...customers];
      updatedCustomers[existingCustomerIndex] = {
        ...updatedCustomers[existingCustomerIndex],
        totalVisits: updatedCustomers[existingCustomerIndex].totalVisits + 1,
        pets: [...updatedCustomers[existingCustomerIndex].pets, newPet],
      };
      setCustomers(updatedCustomers);
    } else {
      const newCustomer: Customer = {
        id: customerId,
        fullName: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        pets: [newPet],
        createdAt: new Date().toISOString().split('T')[0],
        totalVisits: 1,
      };
      setCustomers((prev) => [newCustomer, ...prev]);
    }

    const newAppointment: Appointment = {
      id: appointmentId,
      confirmationCode,
      customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      pet: newPet,
      serviceId: selectedService.id,
      serviceName: selectedService.title,
      serviceDuration: selectedService.durationMinutes,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      date: data.date,
      timeSlot: data.timeSlot,
      status: 'confirmed',
      specialRequirements: data.specialRequirements,
      totalPriceInr: selectedService.priceInr,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    showToast(`Appointment confirmed! Booking Reference: ${confirmationCode}`, 'success');
    return newAppointment;
  };

  const rescheduleAppointment = (
    appointmentId: string,
    newDate: string,
    newTimeSlot: string
  ): boolean => {
    let found = false;
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          found = true;
          return {
            ...apt,
            date: newDate,
            timeSlot: newTimeSlot,
            status: 'rescheduled' as AppointmentStatus,
          };
        }
        return apt;
      })
    );
    if (found) {
      showToast('Appointment successfully rescheduled!', 'success');
    }
    return found;
  };

  const cancelAppointment = (appointmentId: string, reason?: string): boolean => {
    let found = false;
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          found = true;
          return {
            ...apt,
            status: 'cancelled' as AppointmentStatus,
            cancellationReason: reason || 'Cancelled by customer',
          };
        }
        return apt;
      })
    );
    if (found) {
      showToast('Appointment has been cancelled.', 'info');
    }
    return found;
  };

  const findAppointmentByCodeOrPhone = (query: string): Appointment[] => {
    const cleaned = query.trim().toUpperCase();
    const digits = query.replace(/\D/g, '');

    return appointments.filter((apt) => {
      const matchCode = apt.confirmationCode.toUpperCase() === cleaned;
      const aptDigits = apt.customerPhone.replace(/\D/g, '');
      const matchPhone = digits.length >= 4 && aptDigits.includes(digits);
      return matchCode || matchPhone;
    });
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    showToast(`Status updated to "${status.replace('_', ' ')}"`, 'info');
  };

  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      id: `srv-${Date.now()}`,
      ...serviceData,
    };
    setServices((prev) => [newService, ...prev]);
    showToast('New grooming service added to catalog', 'success');
  };

  const updateService = (updated: Service) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast('Service updated successfully', 'success');
  };

  const toggleStaffActive = (id: string) => {
    setStaff((prev) =>
      prev.map((st) => (st.id === id ? { ...st, active: !st.active } : st))
    );
    showToast('Stylist availability updated', 'info');
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    showToast(`Inquiry marked as ${status}`, 'info');
  };

  const toggleReminderRule = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    showToast('Reminder rule updated', 'info');
  };

  const updateReminderTemplate = (id: string, template: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, templateMessage: template } : r))
    );
    showToast('Message template saved', 'success');
  };

  const registerConfirmedBooking = (doc: any) => {
    if (!doc) return;
    const petWeight = Number(doc.pet?.weightKg) || 12;
    const petSize = petWeight < 10 ? 'small' : petWeight < 22 ? 'medium' : petWeight < 40 ? 'large' : 'giant';

    const newApt: Appointment = {
      id: doc.id || `apt-${Date.now()}`,
      confirmationCode: doc.confirmationCode || 'PP-9999',
      customerId: doc.customerId || doc.customerUid || 'cust-direct',
      customerName: doc.customerName || 'Studio Client',
      customerPhone: doc.customerPhone || '+91 98220 00000',
      customerEmail: doc.customerEmail || 'client@pawandpolish.in',
      pet: {
        id: doc.pet?.id || `pet-${Date.now()}`,
        name: doc.pet?.name || 'Pet',
        species: doc.pet?.species || 'dog',
        breed: doc.pet?.breed || 'Companion',
        size: petSize,
        weightKg: petWeight,
        temperament: doc.pet?.temperament || 'friendly',
        specialNotes: doc.preferences?.specialNotes || doc.pet?.specialRequirements || '',
      },
      serviceId: doc.serviceId || 'srv-1',
      serviceName: doc.serviceName || 'Studio Groom',
      serviceDuration: Number(doc.durationMinutes) || 75,
      staffId: doc.staffId || 'staff-1',
      staffName: doc.staffName || 'Aarti Deshmukh',
      date: doc.date || new Date().toISOString().split('T')[0],
      timeSlot: doc.startTime || '11:00 AM',
      status: 'requested',
      specialRequirements: doc.preferences?.specialNotes || '',
      totalPriceInr: Number(doc.priceInr) || 1800,
      createdAt: doc.createdAt || new Date().toISOString(),
    };

    setAppointments((prev) => [newApt, ...prev.filter((a) => a.id !== newApt.id)]);

    // Check customer directory
    setCustomers((prev) => {
      const idx = prev.findIndex(
        (c) => c.phone.replace(/\D/g, '') === newApt.customerPhone.replace(/\D/g, '')
      );
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          totalVisits: updated[idx].totalVisits + 1,
          pets: [...updated[idx].pets.filter((p) => p.name !== newApt.pet.name), newApt.pet],
        };
        return updated;
      } else {
        const newCust: Customer = {
          id: newApt.customerId,
          fullName: newApt.customerName,
          phone: newApt.customerPhone,
          email: newApt.customerEmail,
          pets: [newApt.pet],
          createdAt: new Date().toISOString().split('T')[0],
          totalVisits: 1,
        };
        return [newCust, ...prev];
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        business,
        services,
        staff,
        customers,
        appointments,
        inquiries,
        reminders,
        currentView,
        setCurrentView,
        ownerActiveTab,
        setOwnerActiveTab,
        toast,
        showToast,
        createAppointment,
        rescheduleAppointment,
        cancelAppointment,
        findAppointmentByCodeOrPhone,
        updateAppointmentStatus,
        addService,
        updateService,
        toggleStaffActive,
        updateInquiryStatus,
        toggleReminderRule,
        updateReminderTemplate,
        manageBookingModalOpen,
        setManageBookingModalOpen,
        prefilledBookingCode,
        setPrefilledBookingCode,
        registerConfirmedBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
