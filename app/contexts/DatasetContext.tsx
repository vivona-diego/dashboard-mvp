'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { DATASETS_METADATA, DatasetMetadata } from '@/app/lib/datasets-config';

interface DatasetContextType {
  selectedDataset: string | null;
  setSelectedDataset: (dataset: string | null) => void;
  getMetadata: (datasetName?: string | null) => DatasetMetadata | null;
  getSegments: (datasetName?: string | null) => string[];
  getMetrics: (datasetName?: string | null) => string[];
  getDateSegment: (datasetName?: string | null) => string;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  const helpers = useMemo(() => {
    const getMetadata = (name?: string | null) => {
      const datasetName = name || selectedDataset;
      if (!datasetName) return null;
      return DATASETS_METADATA[datasetName] || null;
    };

    const getSegments = (name?: string | null) => {
      return getMetadata(name)?.segments || [];
    };

    const getMetrics = (name?: string | null) => {
      return getMetadata(name)?.metrics || [];
    };

    const getDateSegment = (name?: string | null) => {
      const meta = getMetadata(name);
      if (meta?.dateSegment) return meta.dateSegment;
      
      // Fallback logic
      const segments = meta?.segments || [];
      if (segments.includes('Year')) return 'Year';
      if (segments.includes('InvoiceDate')) return 'InvoiceDate';
      if (segments.includes('CreatedDate')) return 'CreatedDate';
      return segments[0] || 'Year';
    };

    return { getMetadata, getSegments, getMetrics, getDateSegment };
  }, [selectedDataset]);

  return (
    <DatasetContext.Provider value={{ selectedDataset, setSelectedDataset, ...helpers }}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
}

