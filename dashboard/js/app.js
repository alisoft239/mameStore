/**
 * app.js - Main application logic
 * @module App
 */

import { loadProducts, saveProducts, generateId } from './storage.js';
import {
  renderProductsList,
  openModal,
  closeModal,
  updateBrandOptions,
  getFormData,
  showValidationErrors,
  clearValidationErrors,
  showNotification,
  setActiveNav,
  setupCategoryListener,
  initializeElements
} from './ui.js';

/**
 * Application state
 * productsByUser = {
 *   userId1: [products],
 *   userId2: [products]
 * }
 */
const state = {
  productsByUser: {},
  currentView: 'products'
};

// ================= USER =================
const user = JSON.parse(localStorage.getItem("currentUser")) || {};
const userId = user.id;

if (!userId) {
  alert("لا يوجد مستخدم مسجل دخول");
  throw new Error("User not logged in");
}

document.querySelector(".user_name").textContent = user.storeName;
// ================= VALIDATION =================
const VALIDATION_RULES = {
  name: { required: true, minLength: 2, message: 'اسم المنتج مطلوب' },
  quantity: { required: true, min: 0, integer: true, message: 'الكمية غير صحيحة' },
  shortDescription: { required: true, minLength: 5, message: 'الوصف المختصر مطلوب' },
  category: { required: true, message: 'اختر النوع' },
  brand: { required: true, message: 'اختر الماركة' },
  price: { required: true, min: 0.01, message: 'السعر غير صحيح' },
  specifications: { required: true, minLength: 10, message: 'المواصفات مطلوبة' },
  weight: { required: true, message: 'الوزن مطلوب' },
  capacity: { required: true, message: 'السعة مطلوبة' },
  ram: { required: true, message: 'الرام مطلوبة' },
  additionalSpecs: { required: true, message: 'المواصفات الإضافية مطلوبة' }
};

const validateProduct = (data) => {
  const errors = {};

  Object.entries(VALIDATION_RULES).forEach(([field, rule]) => {
    const value = data[field];

    if (rule.required && (!value || !String(value).trim())) {
      errors[field] = rule.message;
    }

    if (rule.minLength && value?.length < rule.minLength) {
      errors[field] = rule.message;
    }

    if (rule.integer && !Number.isInteger(Number(value))) {
      errors[field] = rule.message;
    }

    if (rule.min !== undefined && Number(value) < rule.min) {
      errors[field] = rule.message;
    }
  });

  return Object.keys(errors).length ? errors : null;
};

// ================= FORM SUBMIT =================
const handleFormSubmit = (e) => {
  e.preventDefault();

  const formData = getFormData();
  const errors = validateProduct(formData);

  if (errors) {
    showValidationErrors(errors);
    showNotification('يرجى تصحيح الأخطاء', 'error');
    return;
  }

  const isEdit = !!formData.id;

  const product = {
    ...formData,
    id: formData.id || generateId(),
    ownerId: userId,
    createdAt: isEdit ? formData.createdAt : Date.now(),
    updatedAt: Date.now()
  };

  const userProducts = state.productsByUser[userId];

  if (isEdit) {
    const index = userProducts.findIndex(p => p.id === product.id);
    if (index !== -1) userProducts[index] = product;
  } else {
    userProducts.unshift(product);
  }

  saveProducts(state.productsByUser);
  renderProductsList(userProducts);

  closeModal();
  clearValidationErrors();

  showNotification(
    isEdit ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح',
    'success'
  );
};

// ================= DELETE =================
const handleDeleteProduct = (productId) => {
  const confirmed = confirm("هل أنت متأكد من حذف المنتج؟");
  if (!confirmed) return;

  state.productsByUser[userId] =
    state.productsByUser[userId].filter(p => p.id !== productId);

  saveProducts(state.productsByUser);
  renderProductsList(state.productsByUser[userId]);

  showNotification('تم حذف المنتج', 'success');
};

// ================= EDIT =================
const handleEditProduct = (productId) => {
  const product = state.productsByUser[userId]
    .find(p => p.id === productId);

  if (!product) return;
  openModal('edit', product);
};

// ================= CATEGORY =================
const handleCategoryChange = (categoryId) => {
  updateBrandOptions(categoryId);
};

// ================= EVENTS =================
const setupEventListeners = () => {
  document.getElementById('productsTableBody')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const { action, id } = btn.dataset;

    if (action === 'edit') handleEditProduct(id);
    if (action === 'delete') handleDeleteProduct(id);
  });

  document.getElementById('productForm')
    ?.addEventListener('submit', handleFormSubmit);

  setupCategoryListener(handleCategoryChange);

  document.getElementById('openCreateBtn')
    ?.addEventListener('click', () => openModal('create'));

  document.getElementById('closeModalBtn')
    ?.addEventListener('click', closeModal);
};

// ================= INIT =================
const init = () => {
  const storedProducts = loadProducts();
  state.productsByUser = storedProducts || {};

  if (!state.productsByUser[userId]) {
    state.productsByUser[userId] = [];
  }

  initializeElements();
  renderProductsList(state.productsByUser[userId]);
  setActiveNav('products');

  setupEventListeners();

  console.log("✅ Dashboard Ready");
};

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
