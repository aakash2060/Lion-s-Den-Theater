import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  user: any;
  fetchUser: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/authentication/me", {
        withCredentials: true,
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        // 🔇 Silent fail for unauthenticated guest user
        setUser(null);
        setIsAuthenticated(false);
      } else {
        console.error("Unexpected auth error:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/authentication/logout", {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, fetchUser, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
