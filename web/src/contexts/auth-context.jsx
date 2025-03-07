import { useContext, createContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // ✅ Importamos PropTypes
import { profile } from "../services/api-service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profile()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  function login(user) {
    setUser(user);
  }

  function logout() {
    setUser(null);
  }

  const contextData = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuthContext() {
  return useContext(AuthContext);
}
