import { useEffect, useState } from 'react';

const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        const res = await fetchFn();
        if (mounted) {
          setData(res?.data?.data ?? res?.data ?? null);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.response?.data?.message || 'Failed to fetch data');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading, error, setData, setLoading, setError };
};

export default useFetch;