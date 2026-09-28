export type PetSpecies = 'dog' | 'cat';
export type PetSize = 'small' | 'medium' | 'large' | 'giant';
export type PetTemperament = 'calm' | 'friendly' | 'nervous' | 'anxious' | 'reactive';

export type AppointmentStatus =
  | 'requested'
  | 'confirmed'
  | 'in_service'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

export type ServiceCategory = 'full_groom' | 'bath_brush' | 'specialty' | 'quick_care';
export type InquiryStatus = 'new' | 'contacted' | 'resolved';
export type ReminderTrigger = '24h_before' | '2h_before' | 'followup_post_groom';
export type ReminderChannel = 'whatsapp' | 'sms' | 'email';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  size: PetSize;
  weightKg?: number;
  ageYears?: number;
  coatType?: string;
  temperament?: PetTemperament;
  isFirstVisit?: boolean;
  specialNotes?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  pets: Pet[];
  createdAt: string;
  totalVisits: number;
}

export interface Service {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  durationMinutes: number;
  priceInr: number;
  suitableFor: ('dog' | 'cat')[];
  inclusions: string[];
  popular?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  specializations: string[];
  bio: string;
  active: boolean;
  avatarUrl?: string;
  dailyCapacity: number;
}

export interface Appointment {
  id: string;
  confirmationCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pet: Pet;
  serviceId: string;
  serviceName: string;
  serviceDuration: number;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  status: AppointmentStatus;
  specialRequirements?: string;
  totalPriceInr: number;
  createdAt: string;
  cancellationReason?: string;
}

export interface Inquiry {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  petInfo: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface ReminderRule {
  id: string;
  title: string;
  trigger: ReminderTrigger;
  channel: ReminderChannel;
  enabled: boolean;
  leadTimeHours: number;
  templateMessage: string;
}

export interface BusinessProfile {
  name: string;
  tagline: string;
  businessType: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  email: string;
  operatingHours: {
    days: string;
    hours: string;
  };
}
