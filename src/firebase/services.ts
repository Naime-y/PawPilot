import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  CollectionReference,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { ServiceCategory, PetSpecies } from '../types';

/**
 * Firestore Grooming Service Document Schema
 * Defines the structure for the 'services' collection in Firestore.
 */
export interface FirestoreGroomingService {
  id?: string;
  name: string; // Service name (e.g. "Signature Spa & Full Styling")
  duration: number; // Duration in minutes (e.g. 90)
  price: number; // Base price in INR (e.g. 2200)
  description: string; // Description of service
  category: ServiceCategory; // Category: full_groom, bath_brush, specialty, quick_care
  suitableFor: PetSpecies[]; // Array of pet species: ['dog', 'cat']
  inclusions: string[]; // List of package features
  popular?: boolean; // Highlight badge
  active: boolean; // Availability toggle for booking
  businessId: string; // Associated business ('paw-and-polish-pune')
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export const SERVICES_COLLECTION = 'services';

/**
 * Typed reference to the 'services' collection
 */
export const getServicesCollectionRef = (): CollectionReference<DocumentData> => {
  return collection(db, SERVICES_COLLECTION);
};

/**
 * Initial seed catalog for Paw & Polish boutique studio in Kalyani Nagar, Pune
 */
export const PAW_AND_POLISH_DEFAULT_SERVICES: Omit<FirestoreGroomingService, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Signature Spa & Full Styling',
    duration: 90,
    price: 2200,
    description: 'Complete luxury head-to-paw treatment including warm soothing bath, coat conditioning, breed-standard or customized scissor styling, sanitary trim, nail buffing, and ear cleansing.',
    category: 'full_groom',
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
    name: 'Hydrating Bath & High-Velocity Blowdry',
    duration: 60,
    price: 1400,
    description: 'Refreshing cleanse with gentle botanical shampoo, deep coat nourishment, high-velocity blowout to release loose undercoat, and complete coat comb-through.',
    category: 'bath_brush',
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
    name: 'Double-Coat Deshedding Therapy',
    duration: 75,
    price: 1850,
    description: 'Targeted undercoat removal system designed for breeds like Golden Retrievers, German Shepherds, Huskies, and long-hair cats. Reduces shedding by up to 80%.',
    category: 'specialty',
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
    name: "Puppy's Gentle Introduction",
    duration: 45,
    price: 1100,
    description: 'Stress-free introductory session for puppies up to 6 months old. Focuses on positive association with water, dryers, gentle handling, and table socialization.',
    category: 'quick_care',
    suitableFor: ['dog'],
    inclusions: [
      'Lukewarm gentle tearless bath',
      'Low-noise fluff drying',
      'Gentle paw and face touch training',
      'First sanitary trim & nail tip clip',
      'Healthy treat rewards',
    ],
    popular: true,
    active: true,
    businessId: 'paw-and-polish-pune',
  },
  {
    name: 'Feline Velvet Groom & Dematting',
    duration: 60,
    price: 1950,
    description: 'Quiet, feline-specialized grooming session in a calm, dog-free room. Gentle hygiene care, dry or water bath as tolerated, belly clip or lion cut optional.',
    category: 'specialty',
    suitableFor: ['cat'],
    inclusions: [
      'Quiet room feline handling',
      'Waterless foam or warm bath',
      'Sanitary trim & paw pads clearing',
      'Nail cap clipping',
      'Eye and ear fold cleaning',
    ],
    popular: false,
    active: true,
    businessId: 'paw-and-polish-pune',
  },
  {
    name: 'Express Pawdicure & Face Hygiene',
    duration: 30,
    price: 650,
    description: 'Quick maintenance between full grooms: precision nail trimming, paw pad shaving, eye-area trim, and beard wash.',
    category: 'quick_care',
    suitableFor: ['dog', 'cat'],
    inclusions: [
      'Nail trim & Dremel smoothing',
      'Paw pad clearing & soothing paw wax',
      'Eye contour scissor trim',
      'Ear cleansing',
    ],
    popular: false,
    active: true,
    businessId: 'paw-and-polish-pune',
  },
];

/**
 * Fetch all active services from Firestore, filtered optionally by businessId
 */
export async function getFirestoreServices(
  businessId = 'paw-and-polish-pune'
): Promise<FirestoreGroomingService[]> {
  try {
    const q = query(
      collection(db, SERVICES_COLLECTION),
      where('businessId', '==', businessId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        duration: data.duration,
        price: data.price,
        description: data.description,
        category: data.category || 'full_groom',
        suitableFor: data.suitableFor || ['dog'],
        inclusions: data.inclusions || [],
        popular: data.popular ?? false,
        active: data.active ?? true,
        businessId: data.businessId || businessId,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error fetching services from Firestore:', error);
    return [];
  }
}

/**
 * Fetch a single grooming service by ID
 */
export async function getFirestoreServiceById(
  serviceId: string
): Promise<FirestoreGroomingService | null> {
  try {
    const docRef = doc(db, SERVICES_COLLECTION, serviceId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: snap.id,
      name: data.name,
      duration: data.duration,
      price: data.price,
      description: data.description,
      category: data.category || 'full_groom',
      suitableFor: data.suitableFor || ['dog'],
      inclusions: data.inclusions || [],
      popular: data.popular ?? false,
      active: data.active ?? true,
      businessId: data.businessId || 'paw-and-polish-pune',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching service ${serviceId}:`, error);
    return null;
  }
}

/**
 * Create a new service document in Firestore
 */
export async function createFirestoreService(
  serviceData: Omit<FirestoreGroomingService, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = new Date().toISOString();
  const docRef = await addDoc(collection(db, SERVICES_COLLECTION), {
    ...serviceData,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

/**
 * Update an existing grooming service
 */
export async function updateFirestoreService(
  serviceId: string,
  updates: Partial<Omit<FirestoreGroomingService, 'id' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, SERVICES_COLLECTION, serviceId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Seeds initial default services if the collection is currently empty
 */
export async function seedInitialServicesIfEmpty(
  businessId = 'paw-and-polish-pune'
): Promise<void> {
  try {
    const existing = await getFirestoreServices(businessId);
    if (existing.length === 0) {
      const now = new Date().toISOString();
      for (const service of PAW_AND_POLISH_DEFAULT_SERVICES) {
        await addDoc(collection(db, SERVICES_COLLECTION), {
          ...service,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  } catch (err) {
    console.warn('Seeding services skipped or not permitted:', err);
  }
}
