(() => {
  "use strict";

  // Key used to store products in localStorage
  const STORAGE_KEY = "products_dashboard_v1";

  // Category labels (for UI rendering)
  const CATEGORY_LABELS = {
    electronics: "إلكترونيات",
    phones: "تلفونات",
    laptops: "لابتوبات",
    headphones: "سماعات",
    smartwatches: "ساعات ذكية",
    accessories: "إكسسوارات",
  };

  // Brand options by category
  const BRANDS_BY_CATEGORY = {
    phones: ["Apple", "Samsung", "Xiaomi", "Huawei"],
    laptops: ["Dell", "HP", "Lenovo", "Apple"],
    headphones: ["Sony", "JBL", "Anker"],
    smartwatches: ["Apple", "Samsung", "Huawei"],
    electronics: ["Sony", "Samsung", "LG", "Panasonic"],
    accessories: ["Anker", "Baseus", "UGREEN", "Generic"],
  };

  // DOM
  const openCreateBtn = document.getElementById("openCreateBtn");
  const emptyAddBtn = document.getElementById("emptyAddBtn");
  const productsTbody = document.getElementById("productsTbody");
  const productsCount = document.getElementById("productsCount");
  const emptyState = document.getElementById("emptyState");

  const productModal = document.getElementById("productModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");

  const productForm = document.getElementById("productForm");
  const submitBtn = document.getElementById("submitBtn");
  const formHint = document.getElementById("formHint");

  // Fields
  const productId = document.getElementById("productId");
  const productName = document.getElementById("productName");
  const quantity = document.getElementById("quantity");
  const shortDescription = document.getElementById("shortDescription");
  const category = document.getElementById("category");
  const brand = document.getElementById("brand");
  const price = document.getElementById("price");
  const discount = document.getElementById("discount");
  const specifications = document.getElementById("specifications");
  const weight = document.getElementById("weight");
  const capacity = document.getElementById("capacity");
  const ram = document.getElementById("ram");
  const additionalSpecs = document.getElementById("additionalSpecs");

  // Errors
  const errors = {
    name: document.getElementById("productNameError"),
    quantity: document.getElementById("quantityError"),
    shortDescription: document.getElementById("shortDescriptionError"),
    category: document.getElementById("categoryError"),
    brand: document.getElementById("brandError"),
    price: document.getElementById("priceError"),
    discount: document.getElementById("discountError"),
    specifications: document.getElementById("specificationsError"),
    weight: document.getElementById("weightError"),
    capacity: document.getElementById("capacityError"),
    ram: document.getElementById("ramError"),
    additionalSpecs: document.getElementById("additionalSpecsError"),
  };

  let products = loadProducts();

  function loadProducts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }

  function saveProducts(next) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function createId() {
    // Simple unique id (enough for local usage)
    return `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function toNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : NaN;
  }

  function calcPriceAfterDiscount(priceValue, discountValue) {
    const p = toNumber(priceValue);
    const d = toNumber(discountValue);
    if (!Number.isFinite(p) || !Number.isFinite(d)) return NaN;
    const finalValue = p * (1 - d / 100);
    return Math.max(0, finalValue);
  }

  function formatCurrency(value) {
    if (!Number.isFinite(value)) return "—";
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 2,
    }).format(value);
  }

  function categoryLabel(key) {
    return CATEGORY_LABELS[key] ?? key;
  }

  function setBrandsOptions(categoryKey, selectedBrand = "") {
    const list = BRANDS_BY_CATEGORY[categoryKey] ?? [];
    const options = [
      { value: "", label: "اختر الماركة" },
      ...list.map((b) => ({ value: b, label: b })),
    ];

    brand.innerHTML = "";
    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      brand.appendChild(option);
    });

    brand.value = selectedBrand;
  }

  function openModal(mode) {
    productModal.classList.add("is-open");
    productModal.setAttribute("aria-hidden", "false");

    if (mode === "create") {
      modalTitle.textContent = "إضافة منتج";
      modalSubtitle.textContent = "املأ كل الحقول المطلوبة ثم اضغط حفظ.";
      submitBtn.textContent = "حفظ المنتج";
      formHint.textContent = "";
      clearValidationUI();
      productForm.reset();
      productId.value = "";
      setBrandsOptions("", "");

      // Focus first field for UX
      setTimeout(() => productName.focus(), 0);
    }

    if (mode === "edit") {
      modalTitle.textContent = "تعديل منتج";
      modalSubtitle.textContent = "عدّل البيانات ثم اضغط تحديث لحفظ التغييرات.";
      submitBtn.textContent = "تحديث المنتج";
      formHint.textContent = "";
      clearValidationUI();
      setTimeout(() => productName.focus(), 0);
    }

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    productModal.classList.remove("is-open");
    productModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function clearValidationUI() {
    const inputs = productForm.querySelectorAll("input, select, textarea");
    inputs.forEach((el) => el.classList.remove("is-invalid"));
    Object.values(errors).forEach((el) => {
      if (el) el.textContent = "";
    });
  }

  function setFieldError(fieldEl, errorEl, message) {
    fieldEl.classList.add("is-invalid");
    errorEl.textContent = message;
  }

  function validateForm() {
    clearValidationUI();

    let ok = true;

    const nameVal = productName.value.trim();
    const qVal = toNumber(quantity.value);
    const shortVal = shortDescription.value.trim();
    const catVal = category.value;
    const brandVal = brand.value;
    const priceVal = toNumber(price.value);
    const discVal = toNumber(discount.value);
    const specsVal = specifications.value.trim();
    const weightVal = weight.value.trim();
    const capacityVal = capacity.value.trim();
    const ramVal = ram.value.trim();
    const additionalVal = additionalSpecs.value.trim();

    if (!nameVal) {
      ok = false;
      setFieldError(productName, errors.name, "اسم المنتج مطلوب");
    }

    if (!Number.isFinite(qVal) || qVal < 0 || !Number.isInteger(qVal)) {
      ok = false;
      setFieldError(
        quantity,
        errors.quantity,
        "الكمية يجب أن تكون رقم صحيح 0 أو أكبر",
      );
    }

    if (!shortVal) {
      ok = false;
      setFieldError(
        shortDescription,
        errors.shortDescription,
        "الوصف المختصر مطلوب",
      );
    }

    if (!catVal) {
      ok = false;
      setFieldError(category, errors.category, "النوع مطلوب");
    }

    if (!brandVal) {
      ok = false;
      setFieldError(brand, errors.brand, "الماركة مطلوبة");
    }

    if (!Number.isFinite(priceVal) || priceVal <= 0) {
      ok = false;
      setFieldError(price, errors.price, "السعر يجب أن يكون رقم أكبر من 0");
    }

    if (!Number.isFinite(discVal) || discVal < 0 || discVal > 100) {
      ok = false;
      setFieldError(discount, errors.discount, "الخصم يجب أن يكون بين 0 و 100");
    }

    if (!specsVal) {
      ok = false;
      setFieldError(
        specifications,
        errors.specifications,
        "مواصفات المنتج مطلوبة",
      );
    }

    if (!weightVal) {
      ok = false;
      setFieldError(weight, errors.weight, "الوزن مطلوب");
    }

    if (!capacityVal) {
      ok = false;
      setFieldError(capacity, errors.capacity, "السعة مطلوبة");
    }

    if (!ramVal) {
      ok = false;
      setFieldError(ram, errors.ram, "الرام مطلوبة");
    }

    if (!additionalVal) {
      ok = false;
      setFieldError(
        additionalSpecs,
        errors.additionalSpecs,
        "المواصفات الإضافية مطلوبة",
      );
    }

    // Quick UX hint
    if (!ok) {
      formHint.textContent = "راجع الحقول المظللة بالأحمر ثم جرّب مرة أخرى.";
    } else {
      formHint.textContent = "";
    }

    return ok;
  }

  function toProductObject() {
    const id = productId.value || createId();

    const product = {
      id,
      name: productName.value.trim(),
      quantity: Number(quantity.value),
      shortDescription: shortDescription.value.trim(),
      category: category.value,
      brand: brand.value,
      price: Number(price.value),
      discount: Number(discount.value),
      specifications: specifications.value.trim(),
      weight: weight.value.trim(),
      capacity: capacity.value.trim(),
      ram: ram.value.trim(),
      additionalSpecs: additionalSpecs.value.trim(),
      updatedAt: Date.now(),
      createdAt: productId.value ? undefined : Date.now(),
    };

    return product;
  }

  function render() {
    productsCount.textContent = `${products.length} منتج`;

    if (products.length === 0) {
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
    }

    productsTbody.innerHTML = "";

    products.forEach((p) => {
      const tr = document.createElement("tr");

      const finalPrice = calcPriceAfterDiscount(p.price, p.discount);

      tr.innerHTML = `
        <td><strong>${escapeHtml(p.name)}</strong><div class="muted">${escapeHtml(p.shortDescription)}</div></td>
        <td><span class="badge">${escapeHtml(categoryLabel(p.category))}</span></td>
        <td>${escapeHtml(p.brand)}</td>
        <td>${escapeHtml(formatCurrency(finalPrice))}</td>
        <td>${escapeHtml(String(p.quantity))}</td>
        <td>
          <div class="actions">
            <button class="btn btn--ghost btn--sm" type="button" data-action="edit" data-id="${p.id}">
              <i class="fa-solid fa-pen" aria-hidden="true"></i>
              <span>تعديل</span>
            </button>
            <button class="btn btn--danger btn--sm" type="button" data-action="delete" data-id="${p.id}">
              <i class="fa-solid fa-trash" aria-hidden="true"></i>
              <span>حذف</span>
            </button>
          </div>
        </td>
      `;

      productsTbody.appendChild(tr);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function fillFormForEdit(product) {
    productId.value = product.id;
    productName.value = product.name;
    quantity.value = product.quantity;
    shortDescription.value = product.shortDescription;

    category.value = product.category;
    setBrandsOptions(product.category, product.brand);

    brand.value = product.brand;
    price.value = product.price;
    discount.value = product.discount;
    specifications.value = product.specifications;
    weight.value = product.weight;
    capacity.value = product.capacity;
    ram.value = product.ram;
    additionalSpecs.value = product.additionalSpecs;
  }

  function upsertProduct(nextProduct) {
    const idx = products.findIndex((p) => p.id === nextProduct.id);
    if (idx === -1) {
      products = [nextProduct, ...products];
    } else {
      products = products.map((p) =>
        p.id === nextProduct.id ? nextProduct : p,
      );
    }
    saveProducts(products);
    render();
  }

  function deleteProductById(id) {
    products = products.filter((p) => p.id !== id);
    saveProducts(products);
    render();
  }

  // Events
  openCreateBtn.addEventListener("click", () => openModal("create"));
  emptyAddBtn.addEventListener("click", () => openModal("create"));

  closeModalBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  // Close on backdrop click
  productModal.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.close === "true") closeModal();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && productModal.classList.contains("is-open")) {
      closeModal();
    }
  });

  // Dynamic brands based on category
  category.addEventListener("change", () => {
    setBrandsOptions(category.value, "");
  });

  // Table actions (edit/delete)
  productsTbody.addEventListener("click", (e) => {
    const btn =
      e.target instanceof HTMLElement ? e.target.closest("button") : null;
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (!action || !id) return;

    const product = products.find((p) => p.id === id);

    if (action === "edit") {
      if (!product) return;
      fillFormForEdit(product);
      openModal("edit");
      return;
    }

    if (action === "delete") {
      if (!product) return;

      const ok = confirm(`هل أنت متأكد من حذف المنتج: ${product.name} ؟`);
      if (!ok) return;

      deleteProductById(id);
      return;
    }
  });

  // Submit (create/update)
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    const next = toProductObject();
    upsertProduct(next);

    // For debugging/verification
    console.log("Product saved:", next);

    closeModal();
  });

  // Initial UI state
  setBrandsOptions("", "");
  render();
})();
