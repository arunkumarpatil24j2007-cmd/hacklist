import type { Platform } from '../types';

const STORAGE_KEY = 'hacklist_platforms_v1';

/**
 * Retrieve saved platforms from localStorage.
 * CRITICAL REQUIREMENT: Must default to ZERO platforms (empty array []).
 */
export function getSavedPlatforms(): Platform[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Error loading platforms from storage:', err);
    return [];
  }
}

/**
 * Persist platforms array to localStorage
 */
export function savePlatforms(platforms: Platform[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(platforms));
  } catch (err) {
    console.error('Error saving platforms to storage:', err);
  }
}

/**
 * Add a new platform to storage with duplicate checking
 */
export function addPlatformToStorage(
  platformData: Omit<Platform, 'id' | 'createdAt'>,
  currentPlatforms: Platform[]
): { success: boolean; newPlatforms: Platform[]; error?: string } {
  // Check for duplicate URLs (matching normalized domain + path)
  const isDuplicate = currentPlatforms.some(
    (p) => p.url.toLowerCase() === platformData.url.toLowerCase() || p.domain.toLowerCase() === platformData.domain.toLowerCase()
  );

  if (isDuplicate) {
    return {
      success: false,
      newPlatforms: currentPlatforms,
      error: 'This platform URL or domain is already in your HackList.',
    };
  }

  const newPlatform: Platform = {
    ...platformData,
    id: 'platform_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: Date.now(),
  };

  const updated = [newPlatform, ...currentPlatforms];
  savePlatforms(updated);

  return {
    success: true,
    newPlatforms: updated,
  };
}

/**
 * Update an existing platform
 */
export function updatePlatformInStorage(
  id: string,
  updates: Partial<Pick<Platform, 'name' | 'description' | 'url'>>,
  currentPlatforms: Platform[]
): Platform[] {
  const updated = currentPlatforms.map((p) => {
    if (p.id === id) {
      return {
        ...p,
        ...updates,
      };
    }
    return p;
  });

  savePlatforms(updated);
  return updated;
}

/**
 * Delete a platform from storage
 */
export function deletePlatformFromStorage(id: string, currentPlatforms: Platform[]): Platform[] {
  const updated = currentPlatforms.filter((p) => p.id !== id);
  savePlatforms(updated);
  return updated;
}
