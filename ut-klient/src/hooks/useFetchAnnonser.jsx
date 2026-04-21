import { useState, useEffect, useCallback, useMemo } from "react";

// Hook for annonseendepunkter: liste, kort, enkelannonse og CRUD. Laget av Olai
export function useFetchAnnonser({ autoFetch = false, hentAnnonseID = null, token = null, registrerVisningId = null } = {}) {
  const [annonser, setAnnonser] = useState([]);
  const [loadingAnnonser, setLoadingAnnonser] = useState(false);
  const [errorAnnonser, setErrorAnnonser] = useState(null);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token],
  );

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

  // Oppretter en ny annonse på backend.
  const opprettAnnonse = useCallback(
    async (data) => {
      try {
        setLoadingAnnonser(true);
        setErrorAnnonser(null);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Feil ved opprettelse: ${response.status}`);
        return await response.json();
      } catch (err) {
        setErrorAnnonser(err.message);
        throw err;
      } finally {
        setLoadingAnnonser(false);
      }
    },
    [authHeaders],
  );

  // Oppdaterer en annonse med PUT og oppdaterer lokal state.
  const oppdaterAnnonse = useCallback(
    async (id, data) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser/${id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Feil ved oppdatering: ${response.status}`);
      }

      const oppdatert = await response.json();
      setAnnonser((prev) => prev.map((a) => (a.annonse_id === parseInt(id) ? { ...a, ...oppdatert } : a)));
      return oppdatert;
    },
    [authHeaders],
  );

  // Sletter en annonse og oppdaterer lokal state.
  const slettAnnonse = useCallback(
    async (id) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!response.ok) {
        throw new Error(`Feil ved sletting: ${response.status}`);
      }

      setAnnonser((prev) => prev.filter((a) => a.annonse_id !== parseInt(id)));
      return await response.json();
    },
    [authHeaders],
  );

  const registrerVisning = useCallback((id) => {
    if (!id) return;
    fetch(`${import.meta.env.VITE_API_URL}/annonser/${id}/visning`, { method: "POST" }).catch(() => {});
  }, []);

  const registrerKlikk = useCallback((id) => {
    if (!id) return;
    fetch(`${import.meta.env.VITE_API_URL}/annonser/${id}/klikk`, { method: "POST" }).catch(() => {});
  }, []);

  // Henter visnings- og klikkstatistikk for en annonse.
  const hentStatistikk = useCallback(async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser/${id}/statistikk`);
    if (!response.ok) {
      throw new Error(`Feil ved henting av statistikk: ${response.status}`);
    }
    return await response.json();
  }, []);

  // Kjører automatisk henting basert på valgte flagg.
  useEffect(() => {
    if (autoFetch) fetchAnnonser();
    if (hentAnnonseID) hentAnnonseFraId(hentAnnonseID);
  }, [autoFetch, hentAnnonseID, fetchAnnonser, hentAnnonseFraId]);

  useEffect(() => {
    registrerVisning(registrerVisningId);
  }, [registrerVisningId, registrerVisning]);

  return {
    annonser,
    loadingAnnonser,
    errorAnnonser,
    refetch: fetchAnnonser,
    opprettAnnonse,
    hentAnnonseFraId,
    oppdaterAnnonse,
    slettAnnonse,
    hentStatistikk,
    registrerVisning,
    registrerKlikk,
  };
}
