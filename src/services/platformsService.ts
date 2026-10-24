import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import type { Platform } from '../types';
import {
  getSavedPlatforms,
  savePlatforms,
  addPlatformToStorage,
  updatePlatformInStorage,
  deletePlatformFromStorage,
} from '../utils/storage';

const COLLECTION_NAME = 'platforms';

export function isCloudDatabaseActive(): boolean {
  return isFirebaseConfigured && db !== null;
}

/**
 * Subscribes to real-time platform updates from Cloud Firestore
 * or reads from local storage if Firebase is not yet configured.
 */
export function subscribeToPlatforms(
  onUpdate: (platforms: Platform[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (isCloudDatabaseActive() && db) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const platforms: Platform[] = [];
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data() as Omit<Platform, 'id'>;
            platforms.push({
              id: docSnapshot.id,
              url: data.url,
              name: data.name,
              description: data.description,
              domain: data.domain,
              logoUrl: data.logoUrl,
              createdAt: data.createdAt || Date.now(),
            });
          });
          // Cache locally as backup
          savePlatforms(platforms);
          onUpdate(platforms);
        },
        (error) => {
          console.warn('Firestore subscription error (falling back to local cache):', error);
          if (onError) onError(error);
          onUpdate(getSavedPlatforms());
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn('Error creating Firestore listener, using local storage fallback:', err);
      onUpdate(getSavedPlatforms());
      return () => {};
    }
  }

  // Local storage fallback with event listener
  onUpdate(getSavedPlatforms());

  const handleStorageChange = () => {
    onUpdate(getSavedPlatforms());
  };

  window.addEventListener('storage', handleStorageChange);
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}

/**
 * Adds a new platform to the Cloud Database (or localStorage fallback).
 */
export async function addPlatform(
  platformData: Omit<Platform, 'id' | 'createdAt'>,
  currentPlatforms: Platform[]
): Promise<{ success: boolean; newPlatforms?: Platform[]; error?: string }> {
  // Check for duplicate URLs across currently loaded platforms
  const isDuplicate = currentPlatforms.some(
    (p) =>
      p.url.toLowerCase() === platformData.url.toLowerCase() ||
      p.domain.toLowerCase() === platformData.domain.toLowerCase()
  );

  if (isDuplicate) {
    return {
      success: false,
      error: 'This platform URL or domain is already in HackList.',
    };
  }

  const id = 'platform_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newPlatform: Platform = {
    ...platformData,
    id,
    createdAt: Date.now(),
  };

  if (isCloudDatabaseActive() && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await setDoc(docRef, newPlatform);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown Firestore error';
      console.error('Error saving to Cloud Firestore:', err);
      // Fallback to local storage if Firestore write fails
      const fallbackResult = addPlatformToStorage(platformData, currentPlatforms);
      if (fallbackResult.success) {
        return {
          success: true,
          newPlatforms: fallbackResult.newPlatforms,
          error: `Saved locally (Cloud DB error: ${errorMessage})`,
        };
      }
      return { success: false, error: errorMessage };
    }
  }

  // Local-only mode
  const result = addPlatformToStorage(platformData, currentPlatforms);
  return result;
}

/**
 * Updates an existing platform in Cloud Firestore or localStorage
 */
export async function updatePlatform(
  id: string,
  updates: Partial<Pick<Platform, 'name' | 'description'>>,
  currentPlatforms: Platform[]
): Promise<{ success: boolean; error?: string }> {
  if (isCloudDatabaseActive() && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, updates);
      return { success: true };
    } catch (err: unknown) {
      console.error('Error updating in Cloud Firestore:', err);
      updatePlatformInStorage(id, updates, currentPlatforms);
      return { success: true };
    }
  }

  updatePlatformInStorage(id, updates, currentPlatforms);
  return { success: true };
}

/**
 * Deletes a platform from Cloud Firestore or localStorage
 */
export async function deletePlatform(
  id: string,
  currentPlatforms: Platform[]
): Promise<{ success: boolean; error?: string }> {
  if (isCloudDatabaseActive() && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (err: unknown) {
      console.error('Error deleting from Cloud Firestore:', err);
      deletePlatformFromStorage(id, currentPlatforms);
      return { success: true };
    }
  }

  deletePlatformFromStorage(id, currentPlatforms);
  return { success: true };
}
