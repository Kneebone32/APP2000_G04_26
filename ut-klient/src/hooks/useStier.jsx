import { useState, useEffect, useCallback } from 'react';

//Hook til turmål. Laget av Kay
//TODO: må oppdateres når jeg får tested sammen med backend
export function useStier({autoFetch = false} = {}) {
  const [stier, setStier] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  //henter alle Stiene
  const fetchStier = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sti`);
      if (!response.ok) throw new Error(`HTTP feil: ${response.status}`);
      const data = await response.json();

      setStier(data);
    } catch (err) {
        setError(err.message);
        throw err;
    } finally {
        setLoading(false);
    }
  }, []);


  //Lager en ny Sti
  const opprettSti = useCallback(async (data) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/sti`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Kunne ikke lagre stien");

      return await response.json();
    } catch (err){
        setError("er: " + err.message);
        throw err;
    } finally {
        setLoading(false);
    }
  }, []);



  useEffect(() => {
    if (autoFetch) fetchStier();
  }, [autoFetch, fetchStier]);
  
  return { 
    stier: stier, 
    loading, 
    error, 
    opprettSti
  };
}