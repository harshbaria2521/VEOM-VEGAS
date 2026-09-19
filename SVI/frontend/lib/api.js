import axios from 'axios';

// In browser during local dev, use relative /backend-api rewrite to avoid CORS.
// In SSR or production, fall back to NEXT_PUBLIC_API_BASE_URL.
const BASE_URL = typeof window !== 'undefined'
  ? '/backend-api'
  : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5500');

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

// Request interceptor to attach staff authorization if available
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const storedUser = localStorage.getItem('svi_staff_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
  }
  return config;
});

/**
 * Send victim message to FastAPI backend (/ask endpoint)
 * @param {string} message - User query or distress statement
 * @param {object} languageMeta - Selected language details { language, languageCode, nativeName }
 * @returns {Promise<{response: string, tool_called: string}>}
 */
export async function askTherapist(message, languageMeta = {}) {
  try {
    const payload = {
      message,
      language: languageMeta?.language || 'English',
      lang_code: languageMeta?.languageCode || 'en',
      native_name: languageMeta?.nativeName || 'English'
    };
    const response = await axios.post('/api/ask', payload, { timeout: 60000 });
    return response.data;
  } catch (error) {
    console.error('SVI API Error:', error);
    return {
      response: "I am having trouble connecting to the assessment service right now. Please know you are not alone. For immediate confidential support, please call the National Helpline at 14566, Tele-MANAS at 14416, or 112 directly.",
      tool_called: "None"
    };
  }
}

/**
 * Search nearby support services and NGOs via Next.js server-side route (Tavily proxy)
 * @param {string} location - City or District name
 */
export async function searchNearbySupport(location) {
  try {
    const response = await axios.get('/api/nearby-support', {
      params: { location },
    });
    return response.data;
  } catch (err) {
    console.error('Nearby support search failed:', err);
    return {
      success: false,
      results: [],
      fallback: {
        helpline: "14566 (NHAA 24x7)",
        teleManas: "14416 / 1800-891-4416",
        emergency: "112"
      }
    };
  }
}
