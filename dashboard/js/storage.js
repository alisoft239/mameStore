/**
 * storage.js - LocalStorage management module
 * Handles persistence, serialization, and error handling
 * @module Storage
 */

const STORAGE_KEY = 'products_dashboard_v2';

/**
 * Load products grouped by userId from localStorage
 * @returns {Object} productsByUser object
 */
export const loadProducts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);

    // لازم يكون Object
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch (error) {
    console.error('Failed to load products:', error);
    return {};
  }
};

/**
 * Save products grouped by userId to localStorage
 * @param {Object} productsByUser
 * @returns {boolean} Success status
 */
export const saveProducts = (productsByUser) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productsByUser));
    return true;
  } catch (error) {
    console.error('Failed to save products:', error);
    return false;
  }
};

/**
 * Create a unique ID for new products
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Export all products (all users) as JSON file
 * @param {Object} productsByUser
 */
export const exportToJSON = (productsByUser) => {
  const dataStr = JSON.stringify(productsByUser, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `products_export_${new Date()
    .toISOString()
    .split('T')[0]}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Clear all products from storage
 * @returns {boolean} Success status
 */
export const clearAll = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear storage:', error);
    return false;
  }
};
