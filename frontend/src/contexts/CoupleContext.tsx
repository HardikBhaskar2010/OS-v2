import React, { createContext, useContext, useState } from 'react';

interface CoupleData {
  anniversaryDate: Date | null;
  relationshipStart: Date | null;
  partnerNames: [string, string];
  myName: string;
  partnerName: string;
  isLoading: boolean;
}

const CoupleContext = createContext<CoupleData | undefined>(undefined);

export const CoupleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading] = useState(false);

  // Fixed couple data for Cookie and Senorita
  const value: CoupleData = {
    anniversaryDate: new Date(2024, 4, 14), // May 14th, 2024
    relationshipStart: new Date(2024, 1, 14), // Feb 14th, 2024
    partnerNames: ['Cookie', 'Senorita'],
    myName: 'Cookie',
    partnerName: 'Senorita',
    isLoading,
  };

  return (
    <CoupleContext.Provider value={value}>
      {children}
    </CoupleContext.Provider>
  );
};

export const useCouple = () => {
  const context = useContext(CoupleContext);
  if (context === undefined) {
    throw new Error('useCouple must be used within a CoupleProvider');
  }
  return context;
};
