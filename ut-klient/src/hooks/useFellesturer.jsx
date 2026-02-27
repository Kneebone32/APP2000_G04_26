import { useState, useEffect } from 'react';

//Hook til fellesturer. Laget av Kay
//TODO: må oppdateres når jeg får tested sammen med backend
export function useFellestur(autoFetch = true) {
  const [fellesturer, setFellesturer] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  //henter alle fellesturene
  const fetchFellesturer = async () => {
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
  };

  useEffect(() => {
    if (autoFetch) fetchFellesturer();
  }, [autoFetch]);

  //Henter en fellestur basert på ID
  const hentFellesturFraId = async (id) => {
    const response = await fetch(`${`${import.meta.env.VITE_API_URL}/fellestur`}/${id}`);

    if (!response.ok) throw new Error("Kunne ikke hente turen");

    return await response.json();
  };

  //Lager en ny fellestur
  const opprettFellestur = async (data) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Kunne ikke lagre turen");

    return await response.json();
  };

  //Opptaterer en fellestur
  const redigerFellestur = async (id, data) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Kunne ikke oppdatere turen");

    return await response.json();
  };


  //Sletter en fellestur
  const slettFellestur = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur/${id}`, { method: 'slett' });

    if (!response.ok) throw new Error("Kunne ikke slette turen");

    setFellesturer(prev => prev.filter(f => f.fellestur_id !== id));
  };

  
  return { 
    fellestur: fellesturer, 
    loading, 
    error, 
    opprettFellestur, 
    redigerFellestur, 
    hentFellesturFraId, 
    slettFellestur 
  };
}