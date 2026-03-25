import { useState, useEffect, useCallback } from 'react';

//Hook til fellesturer. Laget av Kay
//TODO: må oppdateres når jeg får tested sammen med backend
export function useFellestur({autoFetch = false, hentTurID = null} = {}) {

  const [fellesturer, setFellesturer] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  //henter alle fellesturene
  const fetchFellesturer = useCallback (async () => {
    console.log("y");
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur`);
      if (!response.ok) throw new Error(`HTTP feil: ${response.status}`);
      const data = await response.json();
      console.log(data)
      setFellesturer(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);


  //Henter en fellestur basert på ID
  const hentFellesturFraId = useCallback(async (id) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur/${id}`);
      if (!response.ok) throw new Error("Kunne ikke hente turen");

      return await response.json();
    } catch (err){
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  //Lager en ny fellestur
  const opprettFellestur = useCallback(async (data) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Kunne ikke lagre turen");

      return await response.json();
    } catch (err){
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  //Opptaterer en fellestur
  const redigerFellestur = useCallback(async (id, data) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur/${id}`, {
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


  //Sletter en fellestur
  const slettFellestur = useCallback(async (id) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error("Kunne ikke slette turen");

      setFellesturer(prev => prev.filter(f => f.fellestur_id !== id));
    } catch (err){
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) fetchFellesturer();
    if (hentTurID) hentFellesturFraId(hentTurID);
  }, [autoFetch, hentTurID, fetchFellesturer, hentFellesturFraId]);
  
  return {
    fellesturer,
    loadingFellesturer: loading,
    errorFellesturer: error,
    opprettFellestur,
    redigerFellestur,
    hentFellesturFraId,
    slettFellestur
  };
}