/**
 * data.js - Static data for categories and brands
 * @module Data
 */


/*
id → معرف داخلي

label → الاسم اللي يظهر للمستخدم

icon → أيقونة FontAwesome

brands → الماركات المتاحة تحت القسم ده
*/
export const CATEGORIES = {
  electronics: {
    id: 'electronics',
    label: 'إلكترونيات',
    icon: 'fa-plug',
    brands: ['Sony', 'Samsung', 'LG', 'Panasonic', 'Philips']
  },
  phones: {
    id: 'phones',
    label: 'تلفونات',
    icon: 'fa-mobile-screen',
    brands: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus']
  },
  laptops: {
    id: 'laptops',
    label: 'لابتوبات',
    icon: 'fa-laptop',
    brands: ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer']
  },
  headphones: {
    id: 'headphones',
    label: 'سماعات',
    icon: 'fa-headphones',
    brands: ['Sony', 'JBL', 'Anker', 'Bose', 'Beats']
  },
  smartwatches: {
    id: 'smartwatches',
    label: 'ساعات ذكية',
    icon: 'fa-clock',
    brands: ['Apple', 'Samsung', 'Huawei', 'Garmin', 'Fitbit']
  },
  accessories: {
    id: 'accessories',
    label: 'إكسسوارات',
    icon: 'fa-headphones-simple',
    brands: ['Anker', 'Baseus', 'UGREEN', 'Generic', 'Belkin']
  }
};

// الحقول التقنية
export const SPECIFICATIONS_FIELDS = [
  { id: 'weight', label: 'الوزن', placeholder: '180g', icon: 'fa-weight-hanging' },
  { id: 'capacity', label: 'السعة', placeholder: '256GB', icon: 'fa-database' },
  { id: 'ram', label: 'الرام', placeholder: '8GB', icon: 'fa-memory' }
];

export const getCategoryBrands = (categoryId) => {
  return CATEGORIES[categoryId]?.brands || [];
};

export const getCategoryLabel = (categoryId) => {
  return CATEGORIES[categoryId]?.label || categoryId;
};

export const getCategoryIcon = (categoryId) => {
  return CATEGORIES[categoryId]?.icon || 'fa-box';
};

export const getAllCategories = () => {
  return Object.values(CATEGORIES);
};
