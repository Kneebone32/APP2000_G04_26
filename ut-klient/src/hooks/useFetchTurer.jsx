import { useState, useEffect, useCallback } from 'react';

export function useFetchTurer(autoFetch = true) {
  const [turer, setTurer] = useState([]);
  const [loadingTurer, setLoadingTurer] = useState(autoFetch);
  const [errorTurer, setErrorTurer] = useState(null);
  const [turPunkter, setTurPunkter] = useState([]);
  const [loadingTurPunkter, setLoadingTurPunkter] = useState(true);
  const [errorTurPunkter, setErrorTurPunkter] = useState(null);

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
    fetchTurRute
  };
}
