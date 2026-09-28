import { Pet, GroomingService, DurationBreakdown } from '../types/booking';

/**
 * calculateAppointmentDuration()
 *
 * Domain service that evaluates grooming service base duration against pet characteristics:
 * - Base duration from the service
 * - Large/giant weight rules (+30 mins for >= 25 kg, +15 mins for 15-24 kg)
 * - Anxious / Reactive temperament (+30 mins for extra care, sensory breaks, slow pace)
 * - Nervous temperament (+15 mins)
 * - First visit indicator (+15 mins for gentle familiarization and table socialization)
 *
 * Note: Never allow clients to override the calculated duration.
 */
export function calculateAppointmentDuration(
  service: Pick<GroomingService, 'durationMinutes' | 'name'>,
  pet: Pick<Pet, 'weightKg' | 'temperament' | 'isFirstVisit' | 'species'>
): DurationBreakdown {
  const baseDurationMinutes = Math.max(15, service.durationMinutes || 60);
  const adjustments: { label: string; minutes: number; reason: string }[] = [];

  // Rule 1: Pet Weight / Size adjustment
  if (pet.weightKg >= 25) {
    adjustments.push({
      label: 'Large Breed Care (≥25 kg)',
      minutes: 30,
      reason: 'Additional coat surface area and dedicated handling for large dogs',
    });
  } else if (pet.weightKg >= 15) {
    adjustments.push({
      label: 'Medium Breed Care (15-24 kg)',
      minutes: 15,
      reason: 'Medium coat coverage and blowout allowance',
    });
  }

  // Rule 2: Temperament adjustment
  if (pet.temperament === 'anxious' || pet.temperament === 'reactive') {
    adjustments.push({
      label: 'Fear-Free Sensory Breaks (Anxious/Reactive)',
      minutes: 30,
      reason: 'Zero-rush protocol, intermittent calming breaks, and slow dryer acclimation',
    });
  } else if (pet.temperament === 'nervous') {
    adjustments.push({
      label: 'Gentle Handling Protocol (Nervous)',
      minutes: 15,
      reason: 'Gentle table transitions and low-noise drying setting',
    });
  }

  // Rule 3: First Visit adjustment
  if (pet.isFirstVisit) {
    adjustments.push({
      label: 'First Visit Acclimation',
      minutes: 15,
      reason: 'Salon introduction, scent familiarization, and positive treat reinforcement',
    });
  }

  const addedMinutes = adjustments.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalDurationMinutes = baseDurationMinutes + addedMinutes;

  return {
    baseDurationMinutes,
    adjustments,
    totalDurationMinutes,
  };
}

/**
 * Formats duration in minutes into a clean human readable string:
 * e.g., 90 -> "1 hr 30 min", 165 -> "2 hr 45 min", 45 -> "45 min"
 */
export function formatDurationHuman(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
}
