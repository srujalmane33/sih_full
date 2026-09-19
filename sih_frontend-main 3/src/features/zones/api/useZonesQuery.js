import { useState, useEffect } from 'react';
import { fetchZonesFeed } from './zonesApi';

export function useZonesQuery() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const feed = await fetchZonesFeed();
        if (mounted) { setData(feed); setError(null); }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return { data, isLoading, error };
}
