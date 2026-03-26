'use client';

import { useEffect, useState } from 'react';
import Integrations from './Integrations';
import { PluginApp } from '@/types/api';

export default function IntegrationsWrapper() {
  const [apps, setApps] = useState<PluginApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await fetch('https://plug-service.viasocket.com/api/v1/plugins/all');
        if (!res.ok) throw new Error('Failed to fetch apps');
        const data = await res.json();
        setApps(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load apps');
        console.error('Error fetching apps:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  if (loading) {
    return (
      <section className="section-integrations bg-[var(--cream)] py-20 px-12 pb-[182px] max-w-[1200px] mx-auto max-[768px]:py-[60px] max-[768px]:px-5 max-[768px]:pb-[140px] max-[540px]:hidden">
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-[var(--ink)] font-['Poppins',sans-serif]">
            Loading integrations...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-integrations bg-[var(--cream)] py-20 px-12 pb-[182px] max-w-[1200px] mx-auto max-[768px]:py-[60px] max-[768px]:px-5 max-[768px]:pb-[140px] max-[540px]:hidden">
        <div className="flex items-center justify-center py-20">
          <div className="text-red-500 font-['Poppins',sans-serif]">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return <Integrations apps={apps} />;
}
