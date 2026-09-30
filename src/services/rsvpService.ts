import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RSVPGuest, InvitedGuest } from '../types/wedding';
import { initialInvitedGuests } from '../data/weddingData';

const RSVPS_COLLECTION = 'rsvps';
const PADRON_COLLECTION = 'padron';

/**
 * Subscribe to real-time updates for RSVPs from cloud Firestore
 */
export function subscribeToRSVPs(callback: (rsvps: RSVPGuest[]) => void): () => void {
  try {
    const colRef = collection(db, RSVPS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: RSVPGuest[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<RSVPGuest, 'id'>) });
        });
        // Sort newest first
        list.sort((a, b) => {
          const dateB = new Date(b.createdAt || (b as any).submittedAt || 0).getTime();
          const dateA = new Date(a.createdAt || (a as any).submittedAt || 0).getTime();
          return dateB - dateA;
        });
        callback(list);
      },
      (error) => {
        console.error('Error listening to RSVPs in Firestore:', error);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to RSVPs:', err);
    return () => {};
  }
}

function stripUndefined<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Save an RSVP to Cloud Firestore (real-time across all devices)
 */
export async function saveRSVPToCloud(rsvp: RSVPGuest): Promise<void> {
  try {
    const docRef = doc(db, RSVPS_COLLECTION, rsvp.id);
    const cleanData = stripUndefined(rsvp);
    await setDoc(docRef, cleanData);
    console.log('Successfully saved RSVP to cloud:', rsvp.fullName);
  } catch (error) {
    console.error('Error saving RSVP to Firestore:', error);
    throw error;
  }
}

/**
 * Delete an RSVP from Cloud Firestore
 */
export async function deleteRSVPFromCloud(rsvpId: string): Promise<void> {
  try {
    const docRef = doc(db, RSVPS_COLLECTION, rsvpId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting RSVP from Firestore:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates for the Invited Guests Padrón
 */
export function subscribeToPadron(callback: (guests: InvitedGuest[]) => void): () => void {
  try {
    // Sync official master list if needed
    syncOfficialMasterPadron();

    const colRef = collection(db, PADRON_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: InvitedGuest[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<InvitedGuest, 'id'>) });
          });
          callback(list);
        } else {
          callback(initialInvitedGuests);
        }
      },
      (error) => {
        console.error('Error listening to Padron in Firestore:', error);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to Padron:', err);
    return () => {};
  }
}

/**
 * Seeds or synchronizes the official invited guests to Firestore batch
 */
export async function syncOfficialMasterPadron(force = false): Promise<void> {
  try {
    const colRef = collection(db, PADRON_COLLECTION);
    const existing = await getDocs(colRef);
    const hasOldMock = existing.docs.some((d) => d.id === 'inv-90');
    if (existing.empty || force || hasOldMock) {
      const batch = writeBatch(db);
      existing.docs.forEach((d) => {
        batch.delete(d.ref);
      });
      initialInvitedGuests.forEach((guest) => {
        const docRef = doc(db, PADRON_COLLECTION, guest.id);
        batch.set(docRef, stripUndefined(guest));
      });
      await batch.commit();
      console.log('Seeded official 71 invited guests to Firestore.');
    }
  } catch (error) {
    console.warn('Could not sync official padron:', error);
  }
}

export async function seedInitialPadron(): Promise<void> {
  return syncOfficialMasterPadron();
}

/**
 * Save / Update an invited guest in Cloud Firestore
 */
export async function saveInvitedGuestToCloud(guest: InvitedGuest): Promise<void> {
  try {
    const docRef = doc(db, PADRON_COLLECTION, guest.id);
    await setDoc(docRef, stripUndefined(guest));
  } catch (error) {
    console.error('Error saving invited guest to Firestore:', error);
    throw error;
  }
}

/**
 * Delete an invited guest from Cloud Firestore
 */
export async function deleteInvitedGuestFromCloud(guestId: string): Promise<void> {
  try {
    const docRef = doc(db, PADRON_COLLECTION, guestId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting invited guest from Firestore:', error);
    throw error;
  }
}
