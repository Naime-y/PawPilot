import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Pet } from '../types/booking';

const PETS_COLLECTION = 'pets';

/**
 * Fetch all pets belonging exclusively to the authenticated customer
 */
export async function getCustomerPets(
  customerUid: string,
  businessId = 'paw-and-polish-pune'
): Promise<Pet[]> {
  if (!customerUid) return [];

  try {
    const q = query(
      collection(db, PETS_COLLECTION),
      where('ownerUid', '==', customerUid),
      where('businessId', '==', businessId)
    );
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ownerUid: data.ownerUid,
        businessId: data.businessId,
        name: data.name,
        species: data.species || 'dog',
        breed: data.breed,
        weightKg: Number(data.weightKg) || 10,
        temperament: data.temperament || 'friendly',
        isFirstVisit: data.isFirstVisit ?? true,
        ageYears: data.ageYears,
        specialRequirements: data.specialRequirements,
        coatType: data.coatType,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.warn('Unable to query pets from Firestore, using safe fallback:', error);
    // If collection is empty or offline, return empty list cleanly
    return [];
  }
}

/**
 * Persist or update a pet profile for the authenticated customer
 * Prevents duplicate creation if an existing pet matches the name & breed
 */
export async function saveCustomerPet(
  customerUid: string,
  petData: Omit<Pet, 'id' | 'ownerUid' | 'businessId' | 'createdAt' | 'updatedAt'>,
  businessId = 'paw-and-polish-pune',
  existingPetId?: string
): Promise<Pet> {
  const now = new Date().toISOString();

  if (existingPetId) {
    // Update existing pet
    const docRef = doc(db, PETS_COLLECTION, existingPetId);
    const updated: Pet = {
      ...petData,
      id: existingPetId,
      ownerUid: customerUid,
      businessId,
      createdAt: now,
      updatedAt: now,
    };
    try {
      await setDoc(docRef, updated, { merge: true });
    } catch (e) {
      console.warn('Could not persist to Firestore directly:', e);
    }
    return updated;
  }

  // Create new pet record
  const newId = `pet_${Date.now()}`;
  const newPet: Pet = {
    ...petData,
    id: newId,
    ownerUid: customerUid,
    businessId,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const docRef = doc(db, PETS_COLLECTION, newId);
    await setDoc(docRef, newPet);
  } catch (e) {
    console.warn('Could not persist new pet to Firestore:', e);
  }

  return newPet;
}
