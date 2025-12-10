'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DatasetContextType {
  selectedDataset: string | null;
  setSelectedDataset: (dataset: string | null) => void;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  return <DatasetContext.Provider value={{ selectedDataset, setSelectedDataset }}>{children}</DatasetContext.Provider>;
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
}
