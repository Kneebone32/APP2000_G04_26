import { useState, useEffect, useCallback } from 'react';

// Hook til turruter. Laget av Olai med mindre annet er spesifisert
export function useFetchTurer(autoFetch = true) {
  const [turer, setTurer] = useState([]);
  const [loadingTurer, setLoadingTurer] = useState(autoFetch);
  const [errorTurer, setErrorTurer] = useState(null);
  const [turPunkter, setTurPunkter] = useState([]);
  const [loadingTurPunkter, setLoadingTurPunkter] = useState(true);
  const [errorTurPunkter, setErrorTurPunkter] = useState(null);

  // Henter alle turrutene
  const fetchTurer = async () => {
    try {
      setLoadingTurer(true);
      setErrorTurer(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter`);
      
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
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTurer();
    }
  }, [autoFetch]);

  // Oppdaterer en turrute
  const opptaterTur = async (id, data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter/${id}`, {
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
  };

  // Sletter en turrute
  const deleteTur = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter/${id}`, {
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
  };

  // Henter en turrute basert på ID
  const hentTurFraId = useCallback(async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }, []);

  // Henter GPS-punktene for en turrute basert på ID. Laget av Kay
  const fetchTurRute = useCallback(async (tur_id) => {
      try {
        setLoadingTurPunkter(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter/${tur_id}/punkter`);
        if (!response.ok) console.log("Kunne ikke hente tur");
        
        const data = await response.json();
        setTurPunkter(data);

      } catch (err) {
        setErrorTurPunkter(err.message);
      } finally {
        setLoadingTurPunkter(false);
      }
    }, []);


  return { 
    turer, 
    loadingTurer, 
    errorTurer, 
    turPunkter,
    loadingTurPunkter,
    errorTurPunkter,
    refetch: fetchTurer,
    deleteTur,
    opptaterTur,
    hentTurFraId,
    fetchTurRute
  };
}
