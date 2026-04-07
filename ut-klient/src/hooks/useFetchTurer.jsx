import { useState, useEffect, useCallback } from 'react';

// Hook til turruter. Laget av Olai med mindre annet er spesifisert
export function useFetchTurer({autoFetch = false, hentTurID = null, hentTurRuteID = null, turKort = null}  = {}) {
  const [turer, setTurer] = useState([]);
  const [loadingTurer, setLoadingTurer] = useState();
  const [errorTurer, setErrorTurer] = useState(null);
  const [turDetaljer, setTurDetaljer] = useState(null);
  const [turPunkter, setTurPunkter] = useState([]);
  const [loadingTurPunkter, setLoadingTurPunkter] = useState(true);
  const [errorTurPunkter, setErrorTurPunkter] = useState(null);

  // Henter alle turrutene
  const fetchTurer = useCallback (async () => {
    try {
      setLoadingTurer(true);
      setErrorTurer(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tur`);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setTurer(data);
    } catch (err) {
      setErrorTurer(err.message);
    } finally {
      setLoadingTurer(false);
    }
  }, []);


    // Henter en kortversjon av turruter til kortvisning/lister.
    const fetchTurKort = useCallback (async () => {
    try {
      setLoadingTurer(true);
      setErrorTurer(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tur/kort`);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setTurer(data);
    } catch (err) {
      setErrorTurer(err.message);
    } finally {
      setLoadingTurer(false);
    }
  }, []);


  // Oppdaterer en turrute
  const opptaterTur = useCallback (async (id, data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tur/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Feil ved oppdatering: ${response.status}`);
      }

      const result = await response.json();
      setTurer(prevTurer =>
        prevTurer.map(tur => tur.turrute_id === parseInt(id) ? { ...tur, ...data } : tur)
      );
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  }, []);

  // Sletter en turrute
  const deleteTur = useCallback (async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tur/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error ved sletting: ${response.status}`);
      }

      setTurer(prevTur => prevTur.filter(tur => tur.turrute_id !== id));
      
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }, []);

  // Henter en turrute basert på ID
  const hentTurFraId = useCallback(async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tur/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      setTurDetaljer(data);
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  }, []);

  // Henter GPS-punktene for en turrute basert på ID. Laget av Kay
  const fetchTurRute = useCallback(async (tur_id) => {
      try {
        setLoadingTurPunkter(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tur/${tur_id}/punkter`);
        if (!response.ok) console.log("Kunne ikke hente tur");
        
        const data = await response.json();
        setTurPunkter(data);

      } catch (err) {
        setErrorTurPunkter(err.message);
      } finally {
        setLoadingTurPunkter(false);
      }
    }, []);

  // Kjører valgte hentefunksjoner automatisk ut fra hook-innstillingene.
  useEffect(() => {
    if (autoFetch) fetchTurer();
    if (hentTurID) hentTurFraId(hentTurID);
    if (turKort) fetchTurKort();
    if (hentTurRuteID) fetchTurRute(hentTurRuteID)
  }, [autoFetch, hentTurID, hentTurRuteID, turKort, fetchTurer, hentTurFraId, fetchTurRute, fetchTurKort]);

  return {
    turer,
    turDetaljer,
    loadingTurer,
    errorTurer,
    turPunkter,
    loadingTurPunkter,
    errorTurPunkter,
    refetch: fetchTurer,
    fetchTurKort,
    deleteTur,
    opptaterTur,
    hentTurFraId,
    fetchTurRute
  };
}
