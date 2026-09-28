export type UserRole = 'owner' | 'staff' | 'customer' | 'admin';

export interface AppUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string;
  businessId: string; // Multi-business tenant association (e.g. 'paw-and-polish-pune')
}

export interface BusinessEntity {
  id: string; // Primary key e.g., 'paw-and-polish-pune'
  name: string;
  slug: string;
  location: {
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  ownerUids: string[];
  staffUids: string[];
  createdAt: string;
  active: boolean;
}

export interface RolePermissions {
  canManageBusiness: boolean;
  canManageStaff: boolean;
  canManageServices: boolean;
  canManageCustomers: boolean;
  canManageAllAppointments: boolean;
  canUpdateAppointmentStatus: boolean;
  canManageAutomations: boolean;
  canViewAnalytics: boolean;
  canAccessAdmin: boolean;
}

/**
 * Authorization Matrix mapping each role to explicit operational permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  owner: {
    canManageBusiness: true,
    canManageStaff: true,
    canManageServices: true,
    canManageCustomers: true,
    canManageAllAppointments: true,
    canUpdateAppointmentStatus: true,
    canManageAutomations: true,
    canViewAnalytics: true,
    canAccessAdmin: false,
  },
  staff: {
    canManageBusiness: false,
    canManageStaff: false,
    canManageServices: false,
    canManageCustomers: false, // Can only view necessary customer/pet details for appointments
    canManageAllAppointments: false,
    canUpdateAppointmentStatus: true,
    canManageAutomations: false,
    canViewAnalytics: false,
    canAccessAdmin: false,
  },
  customer: {
    canManageBusiness: false,
    canManageStaff: false,
    canManageServices: false,
    canManageCustomers: false,
    canManageAllAppointments: false,
    canUpdateAppointmentStatus: false,
    canManageAutomations: false,
    canViewAnalytics: false,
    canAccessAdmin: false,
  },
  admin: {
    canManageBusiness: true,
    canManageStaff: true,
    canManageServices: true,
    canManageCustomers: true,
    canManageAllAppointments: true,
    canUpdateAppointmentStatus: true,
    canManageAutomations: true,
    canViewAnalytics: true,
    canAccessAdmin: true,
  },
};
