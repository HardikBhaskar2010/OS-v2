import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type SpaceType = 'cookie' | 'senorita' | null;

interface SpaceContextType {
  currentSpace: SpaceType;
  setCurrentSpace: (space: SpaceType) => void;
  logout: () => void;
  displayName: string;
  partnerName: string;
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

export const SpaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSpace, setCurrentSpaceState] = useState<SpaceType>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedSpace = localStorage.getItem('selectedSpace') as SpaceType;
    if (savedSpace) {
      setCurrentSpaceState(savedSpace);
    }
  }, []);

  const setCurrentSpace = (space: SpaceType) => {
    setCurrentSpaceState(space);
    if (space) {
      localStorage.setItem('selectedSpace', space);
    } else {
      localStorage.removeItem('selectedSpace');
    }
  };

  const logout = () => {
    setCurrentSpace(null);
    navigate('/');
  };

  const displayName = currentSpace === 'cookie' ? 'Cookie' : 'Senorita';
  const partnerName = currentSpace === 'cookie' ? 'Senorita' : 'Cookie';

  return (
    <SpaceContext.Provider
      value={{
        currentSpace,
        setCurrentSpace,
        logout,
        displayName,
        partnerName,
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
};

export const useSpace = () => {
  const context = useContext(SpaceContext);
  if (context === undefined) {
    throw new Error('useSpace must be used within a SpaceProvider');
  }
  return context;
};