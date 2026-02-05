// /lib/utils.js

/**
 * Format a number as currency
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export function formatPrice(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Filter products by category
 * @param {Array} products
 * @param {string} category
 * @returns {Array}
 */
export function filterByCategory(products, category) {
  if (category === "All") return products;
  return products.filter((p) => p.category === category);
}

/**
 * Filter products by price range
 * @param {Array} products
 * @param {{min: number, max: number}} range
 * @returns {Array}
 */
export function filterByPriceRange(products, range) {
  return products.filter((p) => p.price >= range.min && p.price <= range.max);
}

/**
 * Sort products
 * @param {Array} products
 * @param {'featured'|'price-low'|'price-high'|'name'} sortBy
 * @returns {Array}
 */
export function sortProducts(products, sortBy) {
  const sorted = [...products];
  if (sortBy === "price-low") return sorted.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") return sorted.sort((a, b) => b.price - a.price);
  if (sortBy === "name") return sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted; // featured or default
}

/**
 * Get related products
 * @param {Array} products
 * @param {string} productId
 * @param {number} count
 * @returns {Array}
 */
export function getRelatedProducts(products, productId, count = 4) {
  return products.filter((p) => p.id !== productId).slice(0, count);
}

/**
 * Capitalize first letter of a string
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Combine class names, filtering falsy values
 * @param  {...any} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
