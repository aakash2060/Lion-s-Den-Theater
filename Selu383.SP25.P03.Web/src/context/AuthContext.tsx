import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

//export const AuthContext = createContext<any>(null);

interface AuthContextType {
  user: any;
  fetchUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);

  // 
  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/authentication/me", {
        withCredentials: true, //
      });
      setUser(response.data); 
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/authentication/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    fetchUser(); // 
  }, []);

  return <AuthContext.Provider value={{ user, fetchUser, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;