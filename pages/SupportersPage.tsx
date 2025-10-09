import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Supporter } from '../types';

// We only need a subset of the Supporter type for public display
type PublicSupporter = Omit<Supporter, 'email'>;

interface SupportersContextType {
  supporters: PublicSupporter[];
  loading: boolean;
  error: string | null;
}

const SupportersContext = createContext<SupportersContextType | undefined>(undefined);

export const SupportersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [supporters, setSupporters] = useState<PublicSupporter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/supporters`);
        if (!response.ok) {
          throw new Error('Failed to fetch supporters.');
        }
        const data: PublicSupporter[] = await response.json();
        setSupporters(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupporters();
  }, []);

  // addSupporter is no longer needed here as submissions are handled by the form directly.

  return (
    <SupportersContext.Provider value={{ supporters, loading, error }}>
      {children}
    </SupportersContext.Provider>
  );
};

export const useSupporters = (): SupportersContextType => {
  const context = useContext(SupportersContext);
  if (!context) {
    throw new Error('useSupporters must be used within a SupportersProvider');
  }
  return context;
};