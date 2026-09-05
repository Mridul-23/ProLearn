import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
let refreshPromise = null;

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const notifySessionExpired = () => {
  clearAuthTokens();
  window.dispatchEvent(new Event('auth:logout'));
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = request?.url?.includes('/user/token/refresh/');

    // A request is retried at most once. This is what prevents a failed refresh
    // or an invalid access token from recursively retrying forever.
    if (!isUnauthorized || request?._retry || request?.skipAuth || isRefreshRequest) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refresh) {
      notifySessionExpired();
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post('/user/token/refresh/', { refresh }, { skipAuth: true })
          .then(({ data }) => {
            localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
            return data.access;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const access = await refreshPromise;
      request.headers = request.headers ?? {};
      request.headers.Authorization = `Bearer ${access}`;
      return api(request);
    } catch (refreshError) {
      notifySessionExpired();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
