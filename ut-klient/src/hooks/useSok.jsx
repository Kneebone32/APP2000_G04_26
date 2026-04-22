// Skrevet av Kristoffer med mindre annet er spesifisert

import { useState, useEffect, useRef } from "react";

// Hook for global søk
export function useSok(q, { debounceMs = 300, minLengde = 2 } = {}) {
  const [resultater, setResultater] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const sokestreng = q.trim();

    if (sokestreng.length < minLengde) {
      setResultater([]);
      setError(null);
      setLoading(false);
      return;
    }

    const timeout = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setLoading(true);
        setError(null);
        const url = `${import.meta.env.VITE_API_URL}/sok?q=${encodeURIComponent(sokestreng)}`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Søk feilet");
        const data = await response.json();
        setResultater(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timeout);
      abortRef.current?.abort();
    };
  }, [q, debounceMs, minLengde]);

  return { resultater, loading, error };
}
