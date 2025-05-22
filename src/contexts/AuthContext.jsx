
import { createContext, useState, useContext, useEffect } from "react";

// Mock data until we have a backend
import { mockPatients, mockDoctors } from "../data/mockData";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('careInsightUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Mock login logic with our mock data
      const foundPatient = mockPatients.find(patient => patient.email === email);
      const foundDoctor = mockDoctors.find(doctor => doctor.email === email);
      const user = foundPatient || foundDoctor || null;
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('careInsightUser', JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, password) => {
    setLoading(true);
    try {
      // Mock registration
      const newUser = {
        id: `user-${Date.now()}`,
        ...userData,
      };
      
      setCurrentUser(newUser);
      localStorage.setItem('careInsightUser', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('careInsightUser');
  };

  const updateUserProfile = async (userData) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...userData,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('careInsightUser', JSON.stringify(updatedUser));
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
