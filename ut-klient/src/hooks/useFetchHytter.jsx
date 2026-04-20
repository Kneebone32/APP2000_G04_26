import { useState, useEffect, useCallback, useMemo } from 'react';

// Hook for hytteendepunkter: liste, kort, enkelthytte og sletting. Laget av Olai med mindre annet er spesifisert.
export function useFetchHytter({autoFetch = false, hentHytteID = null, hytteKort = false, token = null} = {}) {
  const [hytter, setHytter] = useState([]);
  const [hytteDetaljer, setHytteDetaljer] = useState(null);

  const authHeaders = useMemo(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);
  
  const [mineHytteIder, setMineHytteIder] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState(null);

  // Henter full liste av hytter.
  const fetchHytter = useCallback (async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter`);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setHytter(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Henter en komprimert liste av hytter for kortvisning.
    const fetchHytteKort = useCallback (async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/kort`);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setHytter(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  //Henter en hytte basert på ID. Laget av Kay.
  const hentHytteFraId = useCallback (async (id) => {
    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${id}`);
      if (!response.ok) throw new Error("Kunne ikke hente hytten");
      const data = await response.json();
      setHytteDetaljer(data);
      return data;
    } catch (err){
        setError(err.message);
        throw new Error(err.message);
    } finally {
        setLoading(false);
    }
  }, []);

  // Henter hytte_id-er for innlogget hytteeier
  const hentMineHytter = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/mine`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      setMineHytteIder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Oppretter en ny hytte på backend.
  const opprettHytte = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`Feil ved opprettelse: ${response.status}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  // Oppdaterer en eksisterende hytte på backend.
  const oppdaterHytte = useCallback(async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`Feil ved oppdatering: ${response.status}`);
      const result = await response.json();
      setHytter(prev => prev.map(h => h.id === parseInt(id) ? { ...h, ...data } : h));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  // Sletter hytte på backend og oppdaterer lokal state.
  const deleteHytte = useCallback (async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      });

      if (!response.ok) {
        throw new Error(`Error ved sletting: ${response.status}`);
      }

      setHytter(prevHytte => prevHytte.filter(hytte => hytte.hytte_id !== id));

      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [authHeaders]);

  // Kjører automatisk henting basert på hvilke flagg som er satt.
  useEffect(() => {
    if (autoFetch) fetchHytter();
    if (hytteKort) fetchHytteKort();
    if (hentHytteID) hentHytteFraId(hentHytteID);
    if (token) hentMineHytter();
  }, [autoFetch, hentHytteID, hytteKort, token, fetchHytter, hentHytteFraId, fetchHytteKort, hentMineHytter]);

  return {
    hytter,
    hytteDetaljer,
    loading,
    error,
    refetch: fetchHytter,
    opprettHytte,
    oppdaterHytte,
    deleteHytte,
    hentHytteFraId,
    fetchHytteKort,
    hentMineHytter,
    mineHytteIder
  };
}