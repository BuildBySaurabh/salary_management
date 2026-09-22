import axios from "axios";

const configuredUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const baseURL = configuredUrl.replace(/\/$/, "");

const api = axios.create({ baseURL });

const apiRoot = () => baseURL.replace(/\/api\/?$/, "");

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("acme_access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status !== 401 ||
      original?._retry ||
      !localStorage.getItem("acme_refresh")
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshing) {
        refreshing = axios
          .post(`${apiRoot()}/api/token/refresh/`, {
            refresh: localStorage.getItem("acme_refresh"),
          })
          .then(({ data }) => {
            localStorage.setItem("acme_access", data.access);
            if (data.refresh) localStorage.setItem("acme_refresh", data.refresh);
            return data.access;
          })
          .finally(() => {
            refreshing = null;
          });
      }

      const access = await refreshing;
      original.headers.Authorization = `Bearer ${access}`;
      return api(original);
    } catch (refreshError) {
      localStorage.removeItem("acme_access");
      localStorage.removeItem("acme_refresh");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  }
);

export default api;
export { apiRoot, baseURL };
