import { BASE_DOMAIN_URL } from "@/constants";

/**
 * Set a cookie that can be shared across subdomains.
 *
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiration (default 7)
 */
export const setSharedCookie = (name: string, value: any, days = 7): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; domain=${BASE_DOMAIN_URL}`;
};

/**
 * Get a cookie value by name.
 *
 * @param {string} name - Cookie name
 * @returns {string | null} Cookie value or null if not found
 */
export const getCookie = (name: string): any => {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1] || null
  );
};

/**
 * Delete a cookie shared across subdomains.
 *
 * @param {string} name - Cookie name
 */
export const deleteSharedCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${BASE_DOMAIN_URL}`;
};
