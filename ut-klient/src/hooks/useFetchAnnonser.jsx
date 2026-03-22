import { useState, useEffect, useCallback } from "react";

// Hook for annonseendepunkter: liste, kort og enkel annonse. Laget av Olai
export function useFetchAnnonser({ autoFetch = false, hentAnnonseID = null, annonseKort = false } = {}) {
  const [annonser, setAnnonser] = useState([]);
  const [loadingAnnonser, setLoadingAnnonser] = useState(false);
  const [errorAnnonser, setErrorAnnonser] = useState(null);

  const fetchAnnonser = useCallback(async () => {
    try {
      setLoadingAnnonser(true);
      setErrorAnnonser(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setAnnonser(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorAnnonser(err.message);
    } finally {
      setLoadingAnnonser(false);
    }
  }, []);

  // Henter en komprimert liste av annonser for kortvisning.
  const fetchAnnonseKort = useCallback(async () => {
    try {
      setLoadingAnnonser(true);
      setErrorAnnonser(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser/kort`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setAnnonser(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorAnnonser(err.message);
    } finally {
      setLoadingAnnonser(false);
    }
  }, []);

  // Henter en annonse basert på ID.
  const hentAnnonseFraId = useCallback(async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser/${id}`);
      if (!response.ok) throw new Error("Kunne ikke hente annonsen");
      return await response.json();
    } catch (err) {
      setErrorAnnonser(err.message);
    } finally {
      setLoadingAnnonser(false);
    }
  }, []);

  // Kjører automatisk henting basert på valgte flagg.
  useEffect(() => {
    if (autoFetch) fetchAnnonser();
    if (annonseKort) fetchAnnonseKort();
    if (hentAnnonseID) hentAnnonseFraId(hentAnnonseID);
  }, [autoFetch, hentAnnonseID, annonseKort, fetchAnnonser, fetchAnnonseKort, hentAnnonseFraId]);

  return {
    annonser,
    loadingAnnonser,
    errorAnnonser,
    refetch: fetchAnnonser,
    fetchAnnonseKort,
    hentAnnonseFraId,
  };
}