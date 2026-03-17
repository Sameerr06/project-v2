// frontend/src/services/api.js
// Use the VITE_API_URL environment variable if available (e.g., from Render),
// otherwise fallback to empty string (which uses the current host's relative path).

const RAW_API_URL = import.meta.env.VITE_API_URL || '';
let API_BASE_URL = RAW_API_URL.trim();

if (API_BASE_URL) {
  // 1. Ensure protocol
  if (!API_BASE_URL.startsWith('http')) {
    API_BASE_URL = `https://${API_BASE_URL}`;
  }
  
  // 2. Fix Render internal host issue (e.g. "quiz-backend-kdcz" -> "quiz-backend-kdcz.onrender.com")
  // If the hostname doesn't contain a dot and isn't localhost, it's likely a Render internal host.
  try {
    const url = new URL(API_BASE_URL);
    if (!url.hostname.includes('.') && url.hostname !== 'localhost') {
      API_BASE_URL = API_BASE_URL.replace(url.hostname, `${url.hostname}.onrender.com`);
    }
  } catch (e) {
    // Fallback if URL parsing fails
    if (!API_BASE_URL.includes('.') && !API_BASE_URL.includes('localhost')) {
       API_BASE_URL += '.onrender.com';
    }
  }
}

export const getApiUrl = (endpoint) => {
  // Ensure the endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
