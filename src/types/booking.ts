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
export type TimeOfDayPreference = 'morning' | 'afternoon' | 'evening' | 'any';

export interface Pet {
  id: string;
  ownerUid: string;
  businessId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  weightKg: number;
  temperament: PetTemperament;
  isFirstVisit: boolean;
  ageYears?: number;
  specialRequirements?: string;
  coatType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string; // Auth UID
  fullName: string;
  phone: string;
  email: string;
  businessId: string;
  address?: string;
  createdAt: string;
  totalVisits: number;
}

export interface GroomingService {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  durationMinutes: number; // Base duration
  priceInr: number;
  suitableFor: PetSpecies[];
  inclusions: string[];
  popular?: boolean;
  active: boolean;
  businessId: string;
}

export interface StaffMember {
  id: string;
  businessId: string;
  name: string;
  role: string;
  specializations: string[];
  bio: string;
  active: boolean;
  dailyCapacity: number;
}

export interface DurationBreakdown {
  baseDurationMinutes: number;
  adjustments: {
    label: string;
    minutes: number;
    reason: string;
  }[];
  totalDurationMinutes: number;
}

export interface BookingPreferences {
  preferredDate: string; // YYYY-MM-DD
  timeOfDay: TimeOfDayPreference; // 'morning' | 'afternoon' | 'evening' | 'any'
  flexibleDate: boolean;
  preferredTimeSlot?: string; // e.g. "11:30 AM"
  specialNotes?: string;
}

export interface BookingRequestData {
  businessId: string;
  customerId: string;
  customerUid?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  petId: string;
  pet: Pet;
  serviceId: string;
  serviceName: string;
  staffId?: string;
  staffName?: string;
  date: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  durationBreakdown: DurationBreakdown;
  priceInr: number;
  preferences: BookingPreferences;
  status: AppointmentStatus; // Starts as 'requested'
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentDocument extends BookingRequestData {
  id: string;
  confirmationCode: string;
}

export interface BusinessProfile {
  id: string;
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
