'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
    fetch('https://plug-service.viasocket.com/get-apps-count')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.count) {
          setAppsCount(parseInt(data.count, 10).toLocaleString());
        }
      })
      .catch(() => {});
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
