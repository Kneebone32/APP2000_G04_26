import { useState, useEffect, useCallback } from 'react';

export function useFetchHytter({autoFetch = false, hentHytteID = null, hytteKort = false} = {}) {
  const [hytter, setHytter] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState(null);

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



  //Henter en hytte basert på ID
  const hentHytteFraId = useCallback (async (id) => {
    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${id}`);
      if (!response.ok) throw new Error("Kunne ikke hente hytten");
      return await response.json();

    } catch (err){
        setError(err.message);
    } finally {
        setLoading(false);
    }
  }, []);


  const deleteHytte = useCallback (async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error ved sletting: ${response.status}`);
      }

      setHytter(prevHytte => prevHytte.filter(hytte => hytte.hytte_id !== id));
      
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }, []);


    useEffect(() => {
      if (autoFetch) fetchHytter();
      if (hytteKort) fetchHytteKort();
      if (hentHytteID) hentHytteFraId(hentHytteID);
  }, [autoFetch, hentHytteID, hytteKort, fetchHytter, hentHytteFraId, fetchHytteKort]);

  return { 
    hytter, 
    loading, 
    error, 
    refetch: fetchHytter,
    deleteHytte,
    hentHytteFraId,
    fetchHytteKort
  };
}