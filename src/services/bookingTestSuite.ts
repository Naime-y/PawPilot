import { calculateAppointmentDuration, formatDurationHuman } from './durationService';
import { validateBookingSubmission } from './bookingService';
import { BookingRequestData, Pet, GroomingService } from '../types/booking';

/**
 * Automated Test Suite for PawPilot Customer Booking Foundations
 */
export function runBookingTestSuite(): {
  total: number;
  passed: number;
  results: { testName: string; passed: boolean; message: string }[];
} {
  const results: { testName: string; passed: boolean; message: string }[] = [];

  const record = (testName: string, passed: boolean, message: string) => {
    results.push({ testName, passed, message });
  };

  // Test 1: Realistic demo scenario - Bruno the Golden Retriever (Weight: 28kg, Temperament: Anxious, First visit: Yes, Service: Full Groom 90m)
  // Expected: Base 90 + Large 30 + Anxious 30 + First visit 15 = 165 minutes
  const bruno: Pet = {
    id: 'pet_bruno',
    ownerUid: 'user_alex',
    businessId: 'paw-and-polish-pune',
    name: 'Bruno',
    species: 'dog',
    breed: 'Golden Retriever',
    weightKg: 28,
    temperament: 'anxious',
    isFirstVisit: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const fullGroom: GroomingService = {
    id: 'srv_full_groom',
    name: 'Full Groom',
    category: 'full_groom',
    description: 'Complete luxury head-to-paw treatment',
    durationMinutes: 90,
    priceInr: 2200,
    suitableFor: ['dog'],
    inclusions: [],
    active: true,
    businessId: 'paw-and-polish-pune',
  };

  const brunoDuration = calculateAppointmentDuration(fullGroom, bruno);
  record(
    'Bruno Demo Scenario Duration Calculation (Dynamic 165m)',
    brunoDuration.totalDurationMinutes === 165,
    `Calculated ${brunoDuration.totalDurationMinutes} mins. Expected 165 mins (Base 90 + Large 30 + Anxious 30 + First 15).`
  );

  // Test 2: Standard Dog with Calm Temperament and Returning Visit
  // Expected: Base 60 + Medium 15 = 75 minutes
  const coco: Pet = {
    id: 'pet_coco',
    ownerUid: 'user_alex',
    businessId: 'paw-and-polish-pune',
    name: 'Coco',
    species: 'dog',
    breed: 'Beagle',
    weightKg: 16,
    temperament: 'calm',
    isFirstVisit: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const bathService: GroomingService = {
    id: 'srv_bath',
    name: 'Bath & Blow Dry',
    category: 'bath_brush',
    description: 'Bath and dry',
    durationMinutes: 60,
    priceInr: 1400,
    suitableFor: ['dog'],
    inclusions: [],
    active: true,
    businessId: 'paw-and-polish-pune',
  };
  const cocoDuration = calculateAppointmentDuration(bathService, coco);
  record(
    'Coco Returning Medium Dog Duration (75m)',
    cocoDuration.totalDurationMinutes === 75,
    `Calculated ${cocoDuration.totalDurationMinutes} mins. Expected 75 mins.`
  );

  // Test 3: formatDurationHuman formatting
  record(
    'formatDurationHuman for 165 mins',
    formatDurationHuman(165) === '2 hr 45 min',
    `Received: "${formatDurationHuman(165)}"`
  );

  // Test 4: Validation - Customer & Pet Ownership Match
  const validRequest: BookingRequestData = {
    businessId: 'paw-and-polish-pune',
    customerId: 'user_alex',
    customerName: 'Alex',
    customerPhone: '+91 98220 12345',
    customerEmail: 'alex@gmail.com',
    petId: bruno.id,
    pet: bruno,
    serviceId: fullGroom.id,
    serviceName: fullGroom.name,
    staffId: 'staff_maya',
    staffName: 'Maya',
    date: '2026-09-29',
    startTime: '11:30 AM',
    durationMinutes: 165,
    durationBreakdown: brunoDuration,
    priceInr: 2200,
    preferences: {
      preferredDate: '2026-09-29',
      timeOfDay: 'morning',
      flexibleDate: true,
    },
    status: 'requested',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const validationResultOk = validateBookingSubmission(validRequest, 'user_alex');
  record(
    'Validation: Valid Submission Passes',
    validationResultOk === null,
    validationResultOk || 'Valid submission accepted without error.'
  );

  // Test 5: Validation - User trying to submit with mismatch customerId (Impersonation prevention)
  const impersonationResult = validateBookingSubmission(validRequest, 'attacker_user_999');
  record(
    'Validation: Customer Identity Mismatch Rejected',
    impersonationResult !== null && impersonationResult.includes('Security error: Customer identity mismatch'),
    `Result: ${impersonationResult}`
  );

  // Test 6: Validation - Pet belonging to another user
  const tamperedPetRequest = {
    ...validRequest,
    pet: {
      ...bruno,
      ownerUid: 'another_user_id',
    },
  };
  const petOwnershipResult = validateBookingSubmission(tamperedPetRequest, 'user_alex');
  record(
    'Validation: Foreign Pet Ownership Rejected',
    petOwnershipResult !== null && petOwnershipResult.includes('Pet ownership mismatch'),
    `Result: ${petOwnershipResult}`
  );

  // Test 7: Validation - Browser tampering with duration
  const tamperedDurationRequest = {
    ...validRequest,
    durationMinutes: 30, // Attempted reduction from 165
  };
  const durationTamperResult = validateBookingSubmission(tamperedDurationRequest, 'user_alex');
  record(
    'Validation: Tampered Duration Rejected',
    durationTamperResult !== null && durationTamperResult.includes('Duration calculation discrepancy'),
    `Result: ${durationTamperResult}`
  );

  // Test 8: Validation - Invalid or foreign businessId
  const foreignBusinessRequest = {
    ...validRequest,
    businessId: 'other-pet-salon-mumbai',
  };
  const businessValidationResult = validateBookingSubmission(foreignBusinessRequest, 'user_alex');
  record(
    'Validation: Foreign Business Rejected',
    businessValidationResult !== null && businessValidationResult.includes('Invalid studio business'),
    `Result: ${businessValidationResult}`
  );

  const passed = results.filter((r) => r.passed).length;
  return {
    total: results.length,
    passed,
    results,
  };
}
