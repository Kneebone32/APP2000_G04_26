import { useState, useEffect, useCallback } from 'react';

//Hook til turmål. Laget av Kay
export function useTurmål({autoFetch = false, hentTurmålID = null} = {}) {
  const [turmål, setTurmål] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  //henter alle Turmålene
  const fetchTurmål = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turmaal`);
      if (!response.ok) throw new Error(`HTTP feil: ${response.status}`);
      const data = await response.json();

      setTurmål(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  }, []);


  //Henter en turmål basert på ID
  const hentTurmålFraId = useCallback(async (id) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/turmaal/${id}`);
      if (!response.ok) throw new Error("Kunne ikke hente turen");

      return await response.json();
    } catch (err){
        setError(err.message);
        throw err;
    } finally {
        setLoading(false);
    }
  }, []);

  //Lager en ny turmål
  const opprettTurmål = useCallback(async (data) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/turmaal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Kunne ikke lagre turmålet");

      return await response.json();
    } catch (err){
        setError("er: " + err.message);
        throw err;
    } finally {
        setLoading(false);
    }
  }, []);

  //Opptaterer en turmål
  const redigerTurmål = useCallback(async (id, data) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/turmaal/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Kunne ikke oppdatere turen");

      return await response.json();
    } catch (err){
        setError(err.message);
        throw err;
    } finally {
        setLoading(false);
    }
  }, []);


  //Sletter en turmål
  const slettTurmål = useCallback(async (id) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/turmaal/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error("Kunne ikke slette turmålet");

      setTurmål(prev => prev.filter(m => m.turmål !== id));
    } catch (err){
        setError(err.message);
        throw err;
    } finally {
        setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (autoFetch) fetchTurmål();
    if (hentTurmålID) hentTurmålFraId(hentTurmålID);
  }, [autoFetch, hentTurmålID, fetchTurmål, hentTurmålFraId]);
  
  return { 
    turmål: turmål, 
    loading, 
    error, 
    opprettTurmål, 
    redigerTurmål, 
    hentTurmålFraId, 
    slettTurmål 
  };
}