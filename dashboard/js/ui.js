/**
 * ui.js - UI rendering and DOM manipulation module
 * Handles all visual updates, rendering lists, and form management
 * @module UI
 */

import {
  getCategoryLabel,
  getCategoryIcon,
  getCategoryBrands,
} from "./data.js";

// DOM Element References (initialized once)
const elements = {
  productsTableBody: null,
  productsCount: null,
  emptyState: null,
  modal: null,
  modalTitle: null,
  modalSubtitle: null,
  productForm: null,
  brandSelect: null,
  categorySelect: null,
  navLinks: null,
  pageTitle: null,
};

/**
 * Initialize DOM element references
 * Call once at application startup
 */
export const initializeElements = () => {
  elements.productsTableBody = document.getElementById("productsTableBody");
  elements.productsCount = document.getElementById("productsCount");
  elements.emptyState = document.getElementById("emptyState");
  elements.modal = document.getElementById("productModal");
  elements.modalTitle = document.getElementById("modalTitle");
  elements.modalSubtitle = document.getElementById("modalSubtitle");
  elements.productForm = document.getElementById("productForm");
  elements.brandSelect = document.getElementById("brand");
  elements.categorySelect = document.getElementById("category");
  elements.navLinks = document.querySelectorAll(".nav__link");
  elements.pageTitle = document.getElementById("pageTitle");
};

/**
 * Format number as Egyptian Pounds
 * @param {number} value - Price value
 * @returns {string} Formatted currency string
 */

const formatCurrency = (value) => {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Calculate final price after discount
 * @param {number} price - Original price
 * @param {number} discount - Discount percentage
 * @returns {number} Final price
 */
const calculateFinalPrice = (price, discount) => {
  const final = price * (1 - discount / 100);
  return Math.max(0, final); // تضمن ان السعر مش تحت الصفر
};

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Raw text
 * @returns {string} Escaped HTML
 */
const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Create a product row element
 * @param {Object} product - Product data
 * @returns {HTMLTableRowElement} Table row element
 */
const createProductRow = (product) => {
  const row = document.createElement("tr");
  row.className = "table__row";
  row.dataset.productId = product.id;

  const finalPrice = calculateFinalPrice(product.price, product.discount);
  const discountBadge =
    product.discount > 0
      ? `<span class="badge badge--discount">-${product.discount}%</span>`
      : "";

  row.innerHTML = `
    <td class="table__cell table__cell--product">
      <div class="productCell">
        <div class="productCell__icon">
          <i class="fa-solid ${escapeHtml(getCategoryIcon(product.category))}"></i>
        </div>
        <div class="productCell__info">
          <div class="productCell__name">${escapeHtml(product.name)}</div>
          <div class="productCell__desc">${escapeHtml(product.shortDescription)}</div>
        </div>
      </div>
    </td>
    <td class="table__cell">
      <span class="badge badge--category">${escapeHtml(getCategoryLabel(product.category))}</span>
    </td>
    <td class="table__cell">${escapeHtml(product.brand)}</td>
    <td class="table__cell table__cell--price">
      <div class="priceCell">
        <span class="priceCell__final">${formatCurrency(finalPrice)}</span>
        ${product.discount > 0 ? `<span class="priceCell__original">${formatCurrency(product.price)}</span>` : ""}
      </div>
      ${discountBadge}
    </td>
    <td class="table__cell">
      <span class="quantity ${product.quantity < 10 ? "quantity--low" : ""}">${product.quantity}</span>
    </td>
    <td class="table__cell table__cell--actions">
      <div class="actionButtons">
        <button class="btn btn--icon btn--secondary" data-action="edit" data-id="${product.id}" aria-label="تعديل المنتج">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn btn--icon btn--danger" data-action="delete" data-id="${product.id}" aria-label="حذف المنتج">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </td>
  `;

  return row;
};

/**
 * Render products list using DocumentFragment for performance
 * @param {Array} products - Array of product objects
 */
export const renderProductsList = (products) => {
  if (!elements.productsTableBody) return;

  // Update count
  if (elements.productsCount) {
    elements.productsCount.textContent = `${products.length} منتج`;
  }
  console.log(products.length);
  console.log(elements.emptyState);

  // Show/hide empty state
  // if (elements.emptyState) {
  //   elements.emptyState.hidden = products.length > 0;
  // }
  // Empty state logic (FIXED)
  if (elements.emptyState) {
    if (products.length === 0) {
      elements.emptyState.classList.remove("is-hidden");
    } else {
      elements.emptyState.classList.add("is-hidden");
    }
  }

  // Clear table (efficiently)
  elements.productsTableBody.innerHTML = "";

  if (products.length === 0) return;

  // صندوق لاضافة كل شيء مرة واحدة
  // Use DocumentFragment for single DOM insertion
  const fragment = document.createDocumentFragment();
  products.forEach((product) => {
    fragment.appendChild(createProductRow(product));
  });
  elements.productsTableBody.appendChild(fragment);
};

/**
 * Update brand select options based on category
 * @param {string} categoryId - Selected category ID
 * @param {string} selectedBrand - Currently selected brand (for edit mode)
 */
export const updateBrandOptions = (categoryId, selectedBrand = "") => {
  if (!elements.brandSelect) return;

  const brands = getCategoryBrands(categoryId);

  elements.brandSelect.innerHTML = '<option value="">اختر الماركة</option>';

  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    if (brand === selectedBrand) {
      option.selected = true;
    }
    elements.brandSelect.appendChild(option);
  });

  elements.brandSelect.disabled = !categoryId;
};

/**
 * Open modal in create or edit mode
 * @param {string} mode - 'create' or 'edit'
 * @param {Object} product - Product data (for edit mode)
 */
export const openModal = (mode, product = null) => {
  if (!elements.modal || !elements.productForm) return;

  const isEdit = mode === "edit" && product;

  // Set modal content
  elements.modalTitle.textContent = isEdit ? "تعديل منتج" : "إضافة منتج";
  elements.modalSubtitle.textContent = isEdit
    ? "عدّل البيانات ثم اضغط حفظ التغييرات"
    : "املأ كل الحقول المطلوبة ثم اضغط إضافة";

  // Reset or fill form
  elements.productForm.reset();
  clearValidationErrors();

  if (isEdit && product) {
    fillFormWithProduct(product);
  } else {
    elements.productForm.productId.value = "";
    updateBrandOptions("");
  }

  // Show modal
  elements.modal.classList.add("is-open");
  elements.modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Focus first input
  setTimeout(() => {
    const firstInput = elements.productForm.querySelector(
      'input:not([type="hidden"])',
    );
    if (firstInput) firstInput.focus();
  }, 100);
};

/**
 * Close modal
 */
export const closeModal = () => {
  if (!elements.modal) return;

  elements.modal.classList.remove("is-open");
  elements.modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

/**
 * Fill form with product data for editing
 * @param {Object} product - Product data
 */
const fillFormWithProduct = (product) => {
  const form = elements.productForm;
  if (!form) return;

  form.productId.value = product.id;
  form.name.value = product.name;
  form.quantity.value = product.quantity;
  form.shortDescription.value = product.shortDescription;
  form.category.value = product.category;
  form.price.value = product.price;
  form.discount.value = product.discount;
  form.specifications.value = product.specifications;
  form.weight.value = product.weight;
  form.capacity.value = product.capacity;
  form.ram.value = product.ram;
  form.additionalSpecs.value = product.additionalSpecs;

  // Handle images array
  const images = product.images || [];
  form.image1.value = images[0] || "";
  form.image2.value = images[1] || "";
  form.image3.value = images[2] || "";

  // Update brands and set value
  updateBrandOptions(product.category, product.brand);
};

/**
 * Get product data from form
 * @returns {Object} Product data object
 */
export const getFormData = () => {
  const form = elements.productForm;
  if (!form) return null;

  // Collect image links into an array
  const images = [
    form.image1.value.trim(),
    form.image2.value.trim(),
    form.image3.value.trim(),
  ].filter((url) => url !== ""); // Remove empty strings

  return {
    id: form.productId.value,
    name: form.name.value.trim(),
    quantity: parseInt(form.quantity.value, 10),
    shortDescription: form.shortDescription.value.trim(),
    category: form.category.value,
    brand: form.brand.value,
    price: parseFloat(form.price.value),
    discount: parseInt(form.discount.value, 10),
    specifications: form.specifications.value.trim(),
    weight: form.weight.value.trim(),
    capacity: form.capacity.value.trim(),
    ram: form.ram.value.trim(),
    additionalSpecs: form.additionalSpecs.value.trim(),
    // Include individual image fields for validation
    image1: form.image1.value.trim(),
    image2: form.image2.value.trim(),
    image3: form.image3.value.trim(),
    images: images, // Store images as array
  };
};

/**
 * Show validation errors on form fields
 * @param {Object} errors - Object mapping field names to error messages
 */
export const showValidationErrors = (errors) => {
  clearValidationErrors();

  Object.entries(errors).forEach(([fieldName, message]) => {
    const field = document.querySelector(`[name="${fieldName}"]`);
    const errorEl = document.getElementById(`${fieldName}Error`);

    if (field) {
      field.classList.add("is-invalid");
      field.setAttribute("aria-invalid", "true");
    }
    if (errorEl) {
      errorEl.textContent = message;
    }
  });
};

/**
 * Clear all validation errors
 */
export const clearValidationErrors = () => {
  const invalidFields = document.querySelectorAll(".is-invalid");
  invalidFields.forEach((field) => {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
  });

  const errorMessages = document.querySelectorAll(".form__error");
  errorMessages.forEach((el) => (el.textContent = ""));
};

/**
 * Show notification toast
 * @param {string} message - Message to display
 * @param {string} type - 'success' | 'error' | 'info'
 */
export const showNotification = (message, type = "success") => {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "polite");

  const icon =
    type === "success"
      ? "fa-check-circle"
      : type === "error"
        ? "fa-exclamation-circle"
        : "fa-info-circle";

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("toast--visible");
  });

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
};

/**
 * Update active navigation state
 * @param {string} pageId - Current page ID
 */
export const setActiveNav = (pageId) => {
  elements.navLinks?.forEach((link) => {
    const isActive = link.dataset.page === pageId;
    link.classList.toggle("nav__link--active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });

  if (elements.pageTitle) {
    const titles = {
      products: "المنتجات",
      add: "إضافة منتج",
      settings: "الإعدادات",
    };
    elements.pageTitle.textContent = titles[pageId] || "المنتجات";
  }
};

/**
 * Setup category change listener
 * @param {Function} onCategoryChange - Callback when category changes
 */
export const setupCategoryListener = (onCategoryChange) => {
  elements.categorySelect?.addEventListener("change", (e) => {
    onCategoryChange(e.target.value);
  });
};
