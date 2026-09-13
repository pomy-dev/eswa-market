import React, { createContext, useContext, useState, useCallback } from "react";

// Define the shape of our authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  signin: () => Promise<void>;
  signout: () => Promise<void>;
  fetchAccessToken: () => Promise<string | null>;
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const signin = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate an async sign-in process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsAuthenticated(true);
      // For demonstration, you might want to simulate a failure
      // if (Math.random() > 0.5) throw new Error("Dummy signin failed!");
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred during signin."));
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate an async sign-out process
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsAuthenticated(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred during signout."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAccessToken = useCallback(async () => null, []);

  const value = {
    isAuthenticated,
    isLoading,
    error,
    signin,
    signout,
    fetchAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the authentication context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
