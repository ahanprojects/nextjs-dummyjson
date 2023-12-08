import { useState, useEffect } from 'react';

export default function useDynamicFetch<T>(initialUrl: string) {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: T = await response.json();
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const updateUrl = (newUrl: string) => {
    setUrl(newUrl);
  };

  return { data, loading, error, updateUrl };
}