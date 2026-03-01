import { useState, useEffect } from 'react';

//Hook til turmål. Laget av Kay
//TODO: må oppdateres når jeg får tested sammen med backend
export function useTurmål(autoFetch = true) {
  const [turmål, setTurmål] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  //henter alle Turmålene
  const fetchTurmål = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turmal`);
      if (!response.ok) throw new Error(`HTTP feil: ${response.status}`);
      const data = await response.json();
      setTurmål(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) fetchTurmål();
  }, [autoFetch]);

  //Henter en turmål basert på ID
  const hentTurmålFraId = async (id) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/turmal/${id}`);
      if (!response.ok) throw new Error("Kunne ikke hente turen");

      return await response.json();
    } catch (err){
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  //Lager en ny turmål
  const opprettTurmål = async (data) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(encodeURI(`${import.meta.env.VITE_API_URL}/turmal`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Kunne ikke lagre turmålet");

      return await response.json();
    } catch (err){
        setError("er: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  //Opptaterer en turmål
  const redigerTurmål = async (id, data) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/turmal/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Kunne ikke oppdatere turen");

      return await response.json();
    } catch (err){
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };


  //Sletter en turmål
  const slettTurmål = async (id) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/turmal/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error("Kunne ikke slette turmålet");

      setTurmål(prev => prev.filter(m => m.turmål !== id));
    } catch (err){
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  
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