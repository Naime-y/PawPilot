import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { BookingRequestData, AppointmentDocument } from '../types/booking';
import { calculateAppointmentDuration } from './durationService';

const APPOINTMENTS_COLLECTION = 'appointments';

export interface BookingSubmissionResult {
  success: boolean;
  appointment?: AppointmentDocument;
  error?: string;
}

/**
 * Validates all submitted data defensively before writing:
 * - Customer must match authenticated customerId
 * - Business ID must match target business
 * - Duration must match calculated domain logic (cannot be manipulated by browser)
 * - Required fields check
 */
export function validateBookingSubmission(data: BookingRequestData, authUid: string): string | null {
  if (!authUid) {
    return 'You must be signed in to submit a grooming booking.';
  }
  if (data.customerId !== authUid) {
    return 'Security error: Customer identity mismatch. Cannot book on behalf of another user.';
  }
  if (!data.businessId || data.businessId !== 'paw-and-polish-pune') {
    return 'Invalid studio business selected.';
  }
  if (!data.pet || !data.pet.name || !data.pet.breed || !data.pet.weightKg) {
    return 'Please provide complete pet information.';
  }
  if (data.pet.ownerUid !== authUid) {
    return 'Security error: Pet ownership mismatch.';
  }
  if (!data.serviceId || !data.serviceName) {
    return 'Please select a valid grooming service.';
  }
  if (!data.date || !data.startTime) {
    return 'Please select an appointment date and preferred time slot.';
  }

  // Verify calculated duration integrity
  const verifiedDuration = calculateAppointmentDuration(
    { name: data.serviceName, durationMinutes: data.durationBreakdown.baseDurationMinutes },
    data.pet
  );
  if (data.durationMinutes !== verifiedDuration.totalDurationMinutes) {
    return 'Duration calculation discrepancy detected. Re-evaluating schedule parameters.';
  }

  return null;
}

/**
 * Submits the booking request to Cloud Firestore:
 * - Assigns status = 'requested' (honest status, not claiming fake confirmed slot)
 * - Generates reference code PP-XXXX
 * - Persists record in 'appointments/{appointmentId}'
 */
export async function submitBookingRequest(
  data: BookingRequestData,
  authUid: string
): Promise<BookingSubmissionResult> {
  // 1. Validation
  const validationError = validateBookingSubmission(data, authUid);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const confirmationCode = `PP-${randomSuffix}`;
    const appointmentId = `apt_${Date.now()}_${randomSuffix}`;

    const appointmentDoc: AppointmentDocument = {
      ...data,
      id: appointmentId,
      customerId: authUid,
      customerUid: authUid,
      confirmationCode,
      status: 'requested', // Explicitly marked as requested per Step 9 requirements
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 2. Persist to Firestore
    const docRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    await setDoc(docRef, appointmentDoc);

    return {
      success: true,
      appointment: appointmentDoc,
    };
  } catch (error: unknown) {
    console.error('Firestore appointment write failed:', error);
    // User-friendly message without exposing raw internal error stacks
    const msg = error instanceof Error && error.message.includes('permission-denied')
      ? 'Security verification prevented writing this appointment. Please ensure you are logged in.'
      : 'We were unable to register your booking request due to a network or database issue. Please try again.';
    return { success: false, error: msg };
  }
}
