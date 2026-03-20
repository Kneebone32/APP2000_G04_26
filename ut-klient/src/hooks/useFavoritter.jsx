import { useState, useEffect, useCallback, useMemo } from 'react';

//Hook for å håndtere hyttefavoritter. Laget av Kay
//bruker Set for å gjøre søk etter favoritter raskere. 
export function useFavoritter({ token } = {}) {
  const [hytteFavoritter, sethytteFavoritter] = useState(new Set());
  const [turFavoritter, setTurFavoritter] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = useMemo(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);

  //Henter alle favoritthyttene til bruker
  const hentHytteFavoritter = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/favoritter`, {
        headers: authHeaders
      });
      if (!response.ok) throw new Error(`Kunne ikke hente favoritter: ${response.status}`);
      const data = await response.json();
      sethytteFavoritter(new Set(data.map(f => f.hytte_id)));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, token]);

  //Legger til/fjerner en hytte fra favoritter
  const toggleHytteFavoritt = useCallback(async (hytteId) => {
    if (!token) return;
    const erFavoritt = hytteFavoritter.has(hytteId);

    //bruker optimistisk oppdatering slik at oppdateringen visuelt skjer med en gang
    sethytteFavoritter(prev => {
      const ny = new Set(prev);
      erFavoritt ? ny.delete(hytteId) : ny.add(hytteId);
      return ny;
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/favoritter/${hytteId}`, {
        method: erFavoritt ? 'DELETE' : 'POST',
        headers: authHeaders
      });
      if (!response.ok) throw new Error("Kunne ikke oppdatere favoritt");
    } catch (err) {
      //tilbakestiller oppdateringen hvis noe går galt
      sethytteFavoritter(prev => {
        const ny = new Set(prev);
        erFavoritt ? ny.add(hytteId) : ny.delete(hytteId);
        return ny;
      });
      setError(err.message);
    }
  }, [authHeaders, hytteFavoritter, token]);

  


  //Henter alle favoritturene til bruker
  const hentTurFavoritter = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter/favoritter`, {
        headers: authHeaders
      });
      if (!response.ok) throw new Error(`Kunne ikke hente turfavoritter: ${response.status}`);
      const data = await response.json();
      setTurFavoritter(new Set(data.map(f => f.turrute_id)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, token]);

  //Legger til/fjerner en tur fra favoritter
  const toggleTurFavoritt = useCallback(async (turId) => {
    if (!token) return;
    const erFavoritt = turFavoritter.has(turId);

    //bruker optimistisk oppdatering slik at oppdateringen visuelt skjer med en gang
    setTurFavoritter(prev => {
      const ny = new Set(prev);
      erFavoritt ? ny.delete(turId) : ny.add(turId);
      return ny;
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter/favoritter/${turId}`, {
        method: erFavoritt ? 'DELETE' : 'POST',
        headers: authHeaders
      });
      if (!response.ok) throw new Error("Kunne ikke oppdatere turfavoritt");
    } catch (err) {
      //tilbakestiller oppdateringen hvis noe går galt
      setTurFavoritter(prev => {
        const ny = new Set(prev);
        erFavoritt ? ny.add(turId) : ny.delete(turId);
        return ny;
      });
      setError(err.message);
    }
  }, [authHeaders, turFavoritter, token]);

  //Henter favoritter automatisk når token er tilgjengelig
  useEffect(() => {
    if (token) {
      hentHytteFavoritter();
      hentTurFavoritter();
    }
  }, [hentHytteFavoritter, hentTurFavoritter, token]);

  return {
    hytteFavoritter,
    turFavoritter,
    loading,
    error,
    toggleHytteFavoritt,
    toggleTurFavoritt,
    erHytteFavoritt: (hytteId) => hytteFavoritter.has(hytteId),
    erTurFavoritt: (turId) => turFavoritter.has(turId)
  };
}
