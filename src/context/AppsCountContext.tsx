'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchAppsCount } from '@/lib/apps-count';

interface AppsCountContextValue {
  appsCount: string | null;
  displayCount: string;
}

const AppsCountContext = createContext<AppsCountContextValue>({
  appsCount: null,
  displayCount: '2,000+',
});

export function AppsCountProvider({ children }: { children: ReactNode }) {
  const [appsCount, setAppsCount] = useState<string | null>(null);

  useEffect(() => {
    fetchAppsCount().then((count) => {
      if (count) setAppsCount(count);
    });
  }, []);

  const displayCount = appsCount ? `${appsCount}+` : '2,000+';

  return (
    <AppsCountContext.Provider value={{ appsCount, displayCount }}>
      {children}
    </AppsCountContext.Provider>
  );
}

export function useAppsCount() {
  return useContext(AppsCountContext);
}
