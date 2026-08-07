const STORAGE_KEY_FAVORITES = 'omiaa_admin_favorites_v1';

export function getSavedFavorites(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_FAVORITES);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // fallback
  }
  return ['dashboard-overview', 'orders-list', 'products-list', 'products-inventory', 'marketing-coupons'];
}

export const getFavoriteSubModuleIds = getSavedFavorites;

export function toggleFavorite(subItemId: string): string[] {
  const current = getSavedFavorites();
  let updated: string[];
  if (current.includes(subItemId)) {
    updated = current.filter((id) => id !== subItemId);
  } else {
    updated = [...current, subItemId];
  }
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('omiaa_admin_favorites_updated', { detail: updated }));
  } catch {
    // fallback
  }
  return updated;
}

export const toggleFavoriteSubModule = toggleFavorite;

export function isSubModuleFavorite(subItemId: string): boolean {
  return getSavedFavorites().includes(subItemId);
}
