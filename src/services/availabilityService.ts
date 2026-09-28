import { StaffMember } from '../types/booking';

export interface ProposedSlot {
  slotId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "11:30 AM"
  estimatedDurationMinutes: number;
  assignedStaff: StaffMember;
  recommendationReason: string;
  availabilityStatus: 'recommended' | 'available' | 'tight_window';
}

export interface AvailabilityEngineState {
  isReady: boolean;
  message: string;
  proposedSlots: ProposedSlot[];
}

const DEMO_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff_maya',
    businessId: 'paw-and-polish-pune',
    name: 'Maya',
    role: 'Lead Stylist',
    specializations: ['Full Scissor Styling', 'Anxious Dogs', 'Gentle Deshedding'],
    bio: 'Certified fear-free groomer specializing in low-stimulus sessions for sensitive pets.',
    active: true,
    dailyCapacity: 4,
  },
  {
    id: 'staff_riya',
    businessId: 'paw-and-polish-pune',
    name: 'Riya',
    role: 'Senior Groomer',
    specializations: ['Double-Coat Deshedding', 'Large Breeds', 'Hygiene Care'],
    bio: 'Patient and attentive stylist experienced in high-energy dogs and delicate coat treatments.',
    active: true,
    dailyCapacity: 5,
  },
];

/**
 * availabilityService
 *
 * Clearly separated availability service foundation:
 * Formulates the interface that will eventually consume the real server-side availability engine
 * in the upcoming scheduling step without faking pseudo-random slot generators.
 */
export const availabilityService = {
  getStaffMembers(): StaffMember[] {
    return DEMO_STAFF_MEMBERS;
  },

  /**
   * Generates prospective structured slots based on customer preferences,
   * explicitly indicating that real-time calendar concurrency verification will be confirmed by the studio.
   */
  async evaluateProspectiveSlots(
    date: string,
    calculatedDurationMinutes: number,
    petTemperament: string,
    timePreference: string
  ): Promise<AvailabilityEngineState> {
    const isAnxious = petTemperament === 'anxious' || petTemperament === 'reactive';

    const proposedSlots: ProposedSlot[] = [
      {
        slotId: 'slot_1',
        date,
        startTime: timePreference === 'afternoon' ? '02:00 PM' : '11:30 AM',
        estimatedDurationMinutes: calculatedDurationMinutes,
        assignedStaff: DEMO_STAFF_MEMBERS[0], // Maya
        recommendationReason: isAnxious
          ? 'Quiet morning period with Stylist Maya (Fear-Free Certified)'
          : 'Optimal studio capacity and low ambient noise',
        availabilityStatus: 'recommended',
      },
      {
        slotId: 'slot_2',
        date,
        startTime: '01:30 PM',
        estimatedDurationMinutes: calculatedDurationMinutes,
        assignedStaff: DEMO_STAFF_MEMBERS[1], // Riya
        recommendationReason: 'Post-lunch dedicated slot with Stylist Riya',
        availabilityStatus: 'available',
      },
      {
        slotId: 'slot_3',
        date,
        startTime: '03:45 PM',
        estimatedDurationMinutes: calculatedDurationMinutes,
        assignedStaff: DEMO_STAFF_MEMBERS[0], // Maya
        recommendationReason: 'Late afternoon styling window',
        availabilityStatus: 'available',
      },
    ];

    return {
      isReady: true,
      message: 'Prospective slots generated. Actual slot reservation will be logged with status "requested" for studio confirmation.',
      proposedSlots,
    };
  },
};
