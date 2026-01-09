import React, { createContext, useContext, useMemo, useState } from 'react';

import type { Laptop } from '@/lib/mock-data';

type RecommendationsContextValue = {
  recommendations: Laptop[];
  setRecommendations: (items: Laptop[]) => void;
  selectedLaptop: Laptop | null;
  setSelectedLaptop: (laptop: Laptop | null) => void;
};

const RecommendationsContext = createContext<RecommendationsContextValue | null>(null);

export function RecommendationsProvider({ children }: { children: React.ReactNode }) {
  const [recommendations, setRecommendations] = useState<Laptop[]>([]);
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(null);

  const value = useMemo(
    () => ({
      recommendations,
      setRecommendations,
      selectedLaptop,
      setSelectedLaptop,
    }),
    [recommendations, selectedLaptop]
  );

  return <RecommendationsContext.Provider value={value}>{children}</RecommendationsContext.Provider>;
}

export function useRecommendations() {
  const ctx = useContext(RecommendationsContext);
  if (!ctx) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return ctx;
}
