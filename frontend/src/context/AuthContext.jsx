import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import api, { apiRoot } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem("acme_access");
    if (!access) {
      setLoading(false);
      return;
    }

    api.get("/auth/me/")
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem("acme_access");
        localStorage.removeItem("acme_refresh");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${apiRoot()}/api/token/`, {
      username: email.trim().toLowerCase(),
      password,
    });

    localStorage.setItem("acme_access", data.access);
    localStorage.setItem("acme_refresh", data.refresh);
    setUser((await api.get("/auth/me/")).data);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register/", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    localStorage.setItem("acme_access", data.access);
    localStorage.setItem("acme_refresh", data.refresh);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("acme_access");
    localStorage.removeItem("acme_refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
