import axios from 'axios';

// In the browser, use relative paths so cookies are same-origin via Next.js rewrite.
// In SSR (Node.js), use the full server URL directly.
const baseURL =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
    : '';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const { pathname } = window.location;
      // Only force a redirect when the current page actually requires auth.
      // A 401 on a public page (e.g. the "am I logged in?" check on Home)
      // is expected for anonymous visitors and must not force a navigation.
      const isProtectedPage = pathname.startsWith('/dashboard');
      if (isProtectedPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
