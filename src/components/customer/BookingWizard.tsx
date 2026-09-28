import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PetFormData, PetInfoStep } from './PetInfoStep';
import { ServiceSelectStep } from './ServiceSelectStep';
import { SpecialRequirementsStep } from './SpecialRequirementsStep';
import { AvailabilityStep } from './AvailabilityStep';
import { ConfirmationStep } from './ConfirmationStep';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Pet Details' },
  { id: 2, label: 'Service' },
  { id: 3, label: 'Special Needs' },
  { id: 4, label: 'Availability' },
  { id: 5, label: 'Confirm' },
];

export const BookingWizard: React.FC = () => {
  const { services, staff, appointments } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [petData, setPetData] = useState<PetFormData>({
    name: '',
    species: 'dog',
    breed: '',
    size: 'medium',
    weightKg: undefined,
    ageYears: undefined,
    coatType: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
  });

  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-1');
  const [specialRequirements, setSpecialRequirements] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Tomorrow by default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    // If tomorrow is Monday, move to Tuesday
    if (d.getDay() === 1) d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30 AM');

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedStaff = staff.find((st) => st.id === selectedStaffId);

  const handlePetDataChange = (fields: Partial<PetFormData>) => {
    setPetData((prev) => ({ ...prev, ...fields }));
  };

  const handleReset = () => {
    setPetData({
      name: '',
      species: 'dog',
      breed: '',
      size: 'medium',
      weightKg: undefined,
      ageYears: undefined,
      coatType: '',
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
    });
    setSelectedServiceId('srv-1');
    setSpecialRequirements('');
    setCurrentStep(1);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Wizard Progress Ribbon */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-teal-800 text-white'
                        : isCurrent
                        ? 'bg-teal-100 text-teal-900 border-2 border-teal-800 ring-2 ring-teal-700/20'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                  </div>
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

      {/* Step Viewport */}
      <div className="p-6 sm:p-8">
        {currentStep === 1 && (
          <PetInfoStep
            data={petData}
            onChange={handlePetDataChange}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <ServiceSelectStep
            services={services}
            selectedServiceId={selectedServiceId}
            petSpecies={petData.species}
            petName={petData.name}
            onSelect={(id) => setSelectedServiceId(id)}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <SpecialRequirementsStep
            petName={petData.name}
            initialRequirements={specialRequirements}
            onSave={(req) => setSpecialRequirements(req)}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <AvailabilityStep
            staff={staff}
            appointments={appointments}
            selectedStaffId={selectedStaffId}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            petSpecies={petData.species}
            serviceDuration={selectedService?.durationMinutes || 60}
            onSelectStaff={setSelectedStaffId}
            onSelectDate={setSelectedDate}
            onSelectTimeSlot={setSelectedTimeSlot}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <ConfirmationStep
            petData={petData}
            selectedService={selectedService}
            selectedStaff={selectedStaff}
            date={selectedDate}
            timeSlot={selectedTimeSlot}
            specialRequirements={specialRequirements}
            onBack={() => setCurrentStep(4)}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};
