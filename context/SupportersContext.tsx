import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Supporter } from '../types';

// Initial dummy data to showcase the supporters list
const initialSupporters: Supporter[] = [
  { name: 'Jane Doe', email: 'jane@mf.co', company: 'Modern Furniture Co.', role: 'CEO' },
  { name: 'John Smith', email: 'john@ca.com', company: 'Classic Auto Showroom', role: 'Founder' },
  { name: 'Emily White', email: 'emily@tk.store', company: 'The Kitchen Store', role: 'Product Manager' },
  { name: 'Mike Brown', email: 'mike@oghub.com', company: 'Outdoor Gear Hub', role: 'Owner' },
  { name: 'Sarah Green', email: 'sarah@tg.inc', company: 'Tech Gadgets Inc.', role: 'Lead Designer' },
  { name: 'David Black', email: 'david@lwb.com', company: 'Luxury Watch Boutique', role: 'Marketing Director' },
];

interface SupportersContextType {
  supporters: Supporter[];
  addSupporter: (supporter: Supporter) => void;
}

const SupportersContext = createContext<SupportersContextType | undefined>(undefined);

export const SupportersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [supporters, setSupporters] = useState<Supporter[]>(initialSupporters);

  const addSupporter = useCallback((supporter: Supporter) => {
    setSupporters(prevSupporters => [supporter, ...prevSupporters]);
  }, []);

  return (
    <SupportersContext.Provider value={{ supporters, addSupporter }}>
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
