import { useState, useEffect, useCallback, useMemo } from "react";

// Hook for annonseendepunkter: liste, kort, enkelannonse og CRUD. Laget av Olai
export function useFetchAnnonser({ autoFetch = false, hentAnnonseID = null, annonseKort = false, token = null } = {}) {
  const [annonser, setAnnonser] = useState([]);
  const [loadingAnnonser, setLoadingAnnonser] = useState(false);
  const [errorAnnonser, setErrorAnnonser] = useState(null);

  const authHeaders = useMemo(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);

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

  // Oppdaterer en annonse med PUT og oppdaterer lokal state.
  const oppdaterAnnonse = useCallback(async (id, data) => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser/${id}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Feil ved oppdatering: ${response.status}`);
    }

    const oppdatert = await response.json();
    setAnnonser(prev => prev.map(a => a.annonse_id === parseInt(id) ? { ...a, ...oppdatert } : a));
    return oppdatert;
  }, [authHeaders]);

  // Sletter en annonse og oppdaterer lokal state.
  const slettAnnonse = useCallback(async (id) => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    if (!response.ok) {
      throw new Error(`Feil ved sletting: ${response.status}`);
    }

    setAnnonser(prev => prev.filter(a => a.annonse_id !== parseInt(id)));
    return await response.json();
  }, [authHeaders]);

  // Godkjenner en ventende annonse og oppdaterer lokal state.
  const godkjennAnnonse = useCallback(async (id) => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser/${id}/godkjenn`, {
      method: "PUT",
      headers: authHeaders,
    });

    if (!response.ok) {
      throw new Error(`Feil ved godkjenning: ${response.status}`);
    }

    setAnnonser(prev => prev.map(a => a.annonse_id === parseInt(id) ? { ...a, status: "godkjent" } : a));
    return await response.json();
  }, [authHeaders]);

  // Avviser en ventende annonse og oppdaterer lokal state.
  const avvisAnnonse = useCallback(async (id) => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser/${id}/avvis`, {
      method: "PUT",
      headers: authHeaders,
    });

    if (!response.ok) {
      throw new Error(`Feil ved avvisning: ${response.status}`);
    }

    setAnnonser(prev => prev.map(a => a.annonse_id === parseInt(id) ? { ...a, status: "avvist" } : a));
    return await response.json();
  }, [authHeaders]);

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
    oppdaterAnnonse,
    slettAnnonse,
    godkjennAnnonse,
    avvisAnnonse,
    hentStatistikk,
  };
}