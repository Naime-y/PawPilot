import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { GroomingService } from '../types/booking';

const SERVICES_COLLECTION = 'services';

/**
 * Fallback static services for demo & offline reliability in Kalyani Nagar, Pune
 */
export const DEFAULT_STUDIO_SERVICES: GroomingService[] = [
  {
    id: 'srv_full_groom',
    name: 'Full Groom & Precision Scissor Styling',
    category: 'full_groom',
    description: 'Complete luxury head-to-paw treatment including warm soothing bath, coat conditioning, breed-standard scissor styling, sanitary trim, nail buffing, and ear cleansing.',
    durationMinutes: 90,
    priceInr: 2200,
    suitableFor: ['dog', 'cat'],
    inclusions: [
      'Gentle organic oatmeal bath & conditioning',
      'Blowdry & de-shedding brushout',
      'Precision scissor haircut & styling',
      'Sanitary & paw pad trimming',
      'Nail clipping & smooth filing',
      'Ear cleansing & gentle hygiene check',
    ],
    popular: true,
    active: true,
    businessId: 'paw-and-polish-pune',
  },
  {
    id: 'srv_bath_blowdry',
    name: 'Bath & High-Velocity Blow Dry',
    category: 'bath_brush',
    description: 'Refreshing cleanse with botanical shampoo, deep coat nourishment, high-velocity blowout to release loose coat, and thorough comb-through.',
    durationMinutes: 60,
    priceInr: 1400,
    suitableFor: ['dog', 'cat'],
    inclusions: [
      'Double shampoo & coat conditioning wash',
      'High-velocity warm blowdry',
      'Deep brush & detangle',
      'Nail trim & ear wipe',
      'Paw balm application',
    ],
    popular: true,
    active: true,
    businessId: 'paw-and-polish-pune',
  },
  {
    id: 'srv_deshedding',
    name: 'De-shedding Therapy',
    category: 'specialty',
    description: 'Targeted undercoat removal system designed for shedding breeds (Goldens, Shepherds, Huskies). Reduces loose hair shedding by up to 80%.',
    durationMinutes: 75,
    priceInr: 1850,
    suitableFor: ['dog', 'cat'],
    inclusions: [
      'De-shedding enzyme bath',
      'High-velocity undercoat extraction',
      'Furminator brush & comb therapy',
      'Hydrating skin barrier spray',
      'Nail filing',
    ],
    popular: false,
    active: true,
    businessId: 'paw-and-polish-pune',
  },
  {
    id: 'srv_nail_trim',
    name: 'Express Nail Trim & Buffing',
    category: 'quick_care',
    description: 'Safe clipping and electronic rotary filing to eliminate sharp edges without touching the quick.',
    durationMinutes: 20,
    priceInr: 450,
    suitableFor: ['dog', 'cat'],
    inclusions: ['Precision nail clipping', 'Rotary smooth buffing', 'Styptic safety check'],
    popular: false,
    active: true,
    businessId: 'paw-and-polish-pune',
  },
  {
    id: 'srv_paw_face',
    name: 'Paw & Face Trim Hygiene Care',
    category: 'quick_care',
    description: 'Focused sanitary grooming: paw pad shaving, foot shape trimming, eye area cleaning, and muzzle hygiene.',
    durationMinutes: 30,
    priceInr: 650,
    suitableFor: ['dog', 'cat'],
    inclusions: ['Paw pad shaving', 'Eye contour scissor trim', 'Beard wash & comb', 'Ear cleansing'],
    popular: false,
    active: true,
    businessId: 'paw-and-polish-pune',
  },
  {
    id: 'srv_spa_treatment',
    name: 'Ayurvedic Botanical Spa Treatment',
    category: 'specialty',
    description: 'Deep therapeutic skin massage with organic neem, aloe vera, and lavender coat masks. Ideal for sensitive or irritated skin.',
    durationMinutes: 45,
    priceInr: 1200,
    suitableFor: ['dog', 'cat'],
    inclusions: [
      'Warm botanical herbal soak',
      'Gentle pressure-point skin massage',
      'Hypoallergenic conditioning wrap',
      'Lavender aromatherapy spritz',
    ],
    popular: true,
    active: true,
    businessId: 'paw-and-polish-pune',
  },
];

/**
 * Loads active services from Firestore for the target business.
 * Falls back to default studio catalog if database collection is not yet populated.
 */
export async function getActiveServices(
  businessId = 'paw-and-polish-pune'
): Promise<GroomingService[]> {
  try {
    const q = query(
      collection(db, SERVICES_COLLECTION),
      where('businessId', '==', businessId)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      return DEFAULT_STUDIO_SERVICES;
    }

    const services = snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || data.title,
          category: data.category || 'full_groom',
          description: data.description || '',
          durationMinutes: Number(data.duration || data.durationMinutes) || 60,
          priceInr: Number(data.price || data.priceInr) || 1500,
          suitableFor: data.suitableFor || ['dog'],
          inclusions: data.inclusions || [],
          popular: data.popular ?? false,
          active: data.active ?? true,
          businessId: data.businessId || businessId,
        } as GroomingService;
      })
      .filter((s) => s.active);

    return services.length > 0 ? services : DEFAULT_STUDIO_SERVICES;
  } catch (error) {
    console.warn('Using default services catalog due to Firestore fetch error:', error);
    return DEFAULT_STUDIO_SERVICES;
  }
}
