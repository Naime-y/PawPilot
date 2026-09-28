import { AppUserProfile, UserRole, BusinessEntity, ROLE_PERMISSIONS } from '../types/auth';

/**
 * Pure authorization evaluation rules for PawPilot.
 * These functions encode the exact logic validated both in UI routes and in Firestore security rules.
 */

export interface SecurityContext {
  currentUserUid: string | null;
  userRole: UserRole | null;
  userBusinessId: string | null;
}

/**
 * 1. Logged-out user cannot access protected routes
 */
export function canAccessProtectedRoute(context: SecurityContext): boolean {
  return context.currentUserUid !== null && context.userRole !== null;
}

/**
 * 2. Customer cannot access owner dashboard routes
 */
export function canAccessOwnerDashboard(context: SecurityContext): boolean {
  if (!context.currentUserUid || !context.userRole) return false;
  return context.userRole === 'owner' || context.userRole === 'admin';
}

/**
 * 2b. Staff or owner access to studio workspace
 */
export function canAccessStaffWorkspace(context: SecurityContext, targetBusinessId: string): boolean {
  if (!context.currentUserUid || !context.userRole) return false;
  if (context.userRole === 'admin') return true;
  if (context.userRole !== 'owner' && context.userRole !== 'staff') return false;
  return context.userBusinessId === targetBusinessId;
}

/**
 * 3. Staff cannot access another business
 */
export function canStaffAccessBusinessData(
  context: SecurityContext,
  resourceBusinessId: string
): boolean {
  if (!context.currentUserUid) return false;
  if (context.userRole === 'admin') return true;
  if (context.userRole !== 'staff' && context.userRole !== 'owner') return false;
  return context.userBusinessId === resourceBusinessId;
}

/**
 * 4. Customer cannot read another customer's pet
 */
export function canCustomerAccessPet(
  context: SecurityContext,
  petOwnerUid: string,
  petBusinessId: string
): boolean {
  if (!context.currentUserUid) return false;
  if (context.userRole === 'admin') return true;
  // Customer can only read if they are the owner
  if (context.userRole === 'customer') {
    return context.currentUserUid === petOwnerUid;
  }
  // Staff/Owner of the same business can read
  if (context.userRole === 'staff' || context.userRole === 'owner') {
    return context.userBusinessId === petBusinessId;
  }
  return false;
}

/**
 * 5. Customer cannot change their role
 */
export function canUserModifyRole(
  context: SecurityContext,
  targetUserUid: string,
  requestedNewRole: UserRole
): boolean {
  // Only platform admin or trusted backend can change user roles
  if (context.userRole === 'admin') return true;
  // Regular users and customers can NEVER change roles
  return false;
}

/**
 * 6. Owner can manage their own business
 * 7. Owner cannot manage another business
 */
export function canOwnerManageBusiness(
  context: SecurityContext,
  targetBusinessId: string
): boolean {
  if (!context.currentUserUid) return false;
  if (context.userRole === 'admin') return true;
  if (context.userRole !== 'owner') return false;
  return context.userBusinessId === targetBusinessId;
}

/**
 * 8. Authenticated user maps correctly to their Firestore user document
 */
export function isValidUserDocumentMapping(
  authUid: string,
  userDoc: { uid: string }
): boolean {
  return authUid === userDoc.uid;
}
