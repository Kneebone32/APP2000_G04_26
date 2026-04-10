import { useState, useEffect, useCallback, useMemo } from 'react';

//Hook til Stier. Laget av Kay
export function useStier({autoFetch = false, token = null} = {}) {
  const [stier, setStier] = useState([]);

  const authHeaders = useMemo(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);
  
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
        headers: authHeaders,
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
  }, [authHeaders]);



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