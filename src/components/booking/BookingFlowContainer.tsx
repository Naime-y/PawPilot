import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Customer,
  Pet,
  GroomingService,
  DurationBreakdown,
  BookingPreferences,
  BookingRequestData,
  AppointmentDocument,
} from '../../types/booking';
import { ProposedSlot } from '../../services/availabilityService';
import { submitBookingRequest } from '../../services/bookingService';

import { CustomerStep } from './CustomerStep';
import { PetStep } from './PetStep';
import { ServiceStep } from './ServiceStep';
import { PreferencesStep } from './PreferencesStep';
import { AvailabilityStep } from './AvailabilityStep';
import { ReviewStep } from './ReviewStep';
import { ConfirmationStep } from './ConfirmationStep';

import { Check, ArrowLeft } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Customer' },
  { id: 2, label: 'Pet' },
  { id: 3, label: 'Service' },
  { id: 4, label: 'Preferences' },
  { id: 5, label: 'Availability' },
  { id: 6, label: 'Review' },
];

interface BookingFlowContainerProps {
  onFinish?: () => void;
  onOpenMyBookings?: () => void;
}

export const BookingFlowContainer: React.FC<BookingFlowContainerProps> = ({
  onFinish,
  onOpenMyBookings,
}) => {
  const { currentUser } = useAuth();
  const { showToast, registerConfirmedBooking } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Flow State
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [service, setService] = useState<GroomingService | null>(null);
  const [breakdown, setBreakdown] = useState<DurationBreakdown | null>(null);
  const [preferences, setPreferences] = useState<BookingPreferences | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ProposedSlot | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<AppointmentDocument | null>(null);

  // Step 1: Customer Ready
  const handleCustomerReady = (cust: Customer) => {
    setCustomer(cust);
    setCurrentStep(2);
  };

  // Step 2: Pet Selected
  const handlePetSelected = (selectedPet: Pet) => {
    setPet(selectedPet);
    setCurrentStep(3);
  };

  // Step 3: Service Selected with Dynamic Duration
  const handleServiceSelected = (
    selectedService: GroomingService,
    computedBreakdown: DurationBreakdown
  ) => {
    setService(selectedService);
    setBreakdown(computedBreakdown);
    setCurrentStep(4);
  };

  // Step 4: Preferences Ready
  const handlePreferencesReady = (prefs: BookingPreferences) => {
    setPreferences(prefs);
    setCurrentStep(5);
  };

  // Step 5: Slot Selected
  const handleSlotSelected = (slot: ProposedSlot) => {
    setSelectedSlot(slot);
    setCurrentStep(6);
  };

  // Step 6: Final Submission
  const handleSubmitBooking = async (requestData: BookingRequestData) => {
    const authUid = currentUser?.uid || customer?.id || 'demo_user_alex';
    setIsSubmitting(true);
    setSubmissionError(null);

    const result = await submitBookingRequest(requestData, authUid);
    setIsSubmitting(false);

    if (result.success && result.appointment) {
      registerConfirmedBooking(result.appointment);
      setConfirmedAppointment(result.appointment);
      showToast(`Booking request ${result.appointment.confirmationCode} received!`, 'success');
    } else {
      setSubmissionError(result.error || 'Failed to submit booking request.');
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setPet(null);
    setService(null);
    setBreakdown(null);
    setPreferences(null);
    setSelectedSlot(null);
    setConfirmedAppointment(null);
    setSubmissionError(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Wizard Progress Ribbon (Hidden on final confirmation pass) */}
      {!confirmedAppointment && (
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((step, idx) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={step.id > currentStep}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-teal-800 text-white cursor-pointer'
                          : isCurrent
                          ? 'bg-teal-100 text-teal-900 border-2 border-teal-800 ring-2 ring-teal-700/20'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                    </button>
                    <span
                      className={`hidden sm:inline text-xs font-medium ${
                        isCurrent
                          ? 'text-teal-950 font-bold'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-colors ${
                        currentStep > idx + 1 ? 'bg-teal-700' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Step Viewports */}
      <div className="p-6 sm:p-8">
        {confirmedAppointment ? (
          <ConfirmationStep
            appointment={confirmedAppointment}
            onViewAppointments={() => {
              if (onOpenMyBookings) onOpenMyBookings();
            }}
            onReturnHome={() => {
              handleReset();
              if (onFinish) onFinish();
            }}
          />
        ) : (
          <>
            {currentStep === 1 && (
              <CustomerStep onCustomerReady={handleCustomerReady} />
            )}

            {currentStep === 2 && (
              <PetStep
                onPetSelected={handlePetSelected}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && pet && (
              <ServiceStep
                pet={pet}
                selectedService={service}
                onServiceSelected={handleServiceSelected}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && pet && service && (
              <PreferencesStep
                pet={pet}
                service={service}
                initialPreferences={preferences || undefined}
                onPreferencesReady={handlePreferencesReady}
                onBack={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 5 && pet && service && breakdown && preferences && (
              <AvailabilityStep
                pet={pet}
                service={service}
                breakdown={breakdown}
                preferences={preferences}
                selectedSlot={selectedSlot}
                onSlotSelected={handleSlotSelected}
                onBack={() => setCurrentStep(4)}
              />
            )}

            {currentStep === 6 &&
              customer &&
              pet &&
              service &&
              breakdown &&
              preferences &&
              selectedSlot && (
                <ReviewStep
                  customer={customer}
                  pet={pet}
                  service={service}
                  breakdown={breakdown}
                  preferences={preferences}
                  slot={selectedSlot}
                  isSubmitting={isSubmitting}
                  errorMessage={submissionError}
                  onSubmitBooking={handleSubmitBooking}
                  onEditStep={(stepNum) => setCurrentStep(stepNum)}
                />
              )}
          </>
        )}
      </div>
    </div>
  );
};
