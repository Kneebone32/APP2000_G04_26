import { useState, useEffect, useCallback, useMemo } from 'react';

//Hook til fellesturer. Laget av Kay
export function useFellestur({autoFetch = false, hentTurID = null, token = null} = {}) {

  const authHeaders = useMemo(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), [token]);

  const [fellesturer, setFellesturer] = useState([]);
  const [fellestur, setFellestur] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  //henter alle fellesturene
  const fetchFellesturer = useCallback (async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur`);
      if (!response.ok) throw new Error(`HTTP feil: ${response.status}`);
      const data = await response.json();
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

      const data = await response.json();
      setFellestur(data);
      return data;
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
        headers: authHeaders,
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
  }, [authHeaders]);

  //Opptaterer en fellestur
  const redigerFellestur = useCallback(async (id, data) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur/${id}`, {
        method: 'PUT',
        headers: authHeaders,
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
  }, [authHeaders]);


  //Låser en fellestur
  const låsFellestur = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur/${id}/las/fellestur`, {
        method: 'POST',
        headers: authHeaders,
      });
      if (!response.ok) throw new Error('Kunne ikke låse fellesturen');
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  //Låser en dato for en fellestur
  const låsDato = useCallback(async (fellesturId, aktivitetDatoId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur/${fellesturId}/las/dato`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ aktivitet_dato_id: aktivitetDatoId }),
      });
      if (!response.ok) throw new Error('Kunne ikke låse datoen');
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  //Sletter en fellestur
  const slettFellestur = useCallback(async (id) => {
    try{
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!response.ok) throw new Error("Kunne ikke slette turen");

      setFellesturer(prev => prev.filter(f => f.aktivitet_id !== id));
    } catch (err){
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    if (autoFetch) fetchFellesturer();
    if (hentTurID) hentFellesturFraId(hentTurID);
  }, [autoFetch, hentTurID, fetchFellesturer, hentFellesturFraId]);
  
  return {
    fellesturer,
    fellestur,
    loadingFellesturer: loading,
    errorFellesturer: error,
    opprettFellestur,
    redigerFellestur,
    hentFellesturFraId,
    slettFellestur,
    låsFellestur,
    låsDato
  };
}