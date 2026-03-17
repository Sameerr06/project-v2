// frontend/src/services/api.js
// Use the VITE_API_URL environment variable if available (e.g., from Render),
// otherwise fallback to empty string (which uses the current host's relative path).

const RAW_API_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = RAW_API_URL && !RAW_API_URL.startsWith('http') ? `https://${RAW_API_URL}` : RAW_API_URL;
export const getApiUrl = (endpoint) => {
  // Ensure the endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
