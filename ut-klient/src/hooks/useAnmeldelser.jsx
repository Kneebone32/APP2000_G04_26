import { useState, useCallback, useMemo, useEffect } from 'react';

//Hook for å håndtere anmeldelser for hytter og turer. Laget av Kay
export function useAnmeldelser({ token, hytteId, turId } = {}) {
  const [hytteAnmeldelser, setHytteAnmeldelser] = useState([]);
  const [turAnmeldelser, setTurAnmeldelser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const testdataHytte = [{
    "bruker_id": 35,
    "hytte_rating": 5,
    "hytte_anmeldelse": "[testdata] Fin hytte",
    "hytte_opprettet_tidspunkt": "2026-03-17T16:54:51.730Z",
    "bruker_navn": "Admin"
  }]


  const testdataTur = [{
    "bruker_id": 35,
    "turrute_rating": 5,
    "turrute_anmeldelse": "[testdata] Beste sykkelturen i verden!",
    "turrute_opprettet_tidspunkt": "2026-03-17T17:38:36.280Z",
    "bruker_navn": "Admin"
  }]
  

  const authHeaders = useMemo(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);

  /*------------------------------------------------------Hytter------------------------------------------------------ */
  //Henter alle anmeldelser for en hytte
  const hentHytteAnmeldelser = useCallback(async (hytteId) => {
    setHytteAnmeldelser(testdataHytte);
    if (!hytteId || hytteId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${hytteId}/anmeldelser`);
      if (!response.ok) throw new Error(`Kunne ikke hente anmeldelser: ${response.status}`);
      const data = await response.json();
      setHytteAnmeldelser(data);
      console.log(data)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  //Legger til en ny anmeldelse for en hytte
  const leggTilHytteAnmeldelse = useCallback(async (hytteId, {stjerner, kommentar}) => {
    if (!token) return;
    console.log("hook etter token")
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${hytteId}/anmeldelser`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({stjerner, kommentar})
      });
      if (!response.ok) throw new Error(`Kunne ikke legge til anmeldelse: ${response.status}`);
      const ny = await response.json();
      console.log(ny)
      setHytteAnmeldelser(prev => [ny, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  }, [authHeaders, token]);

  //Sletter en anmeldelse fra en hytte
  const slettHytteAnmeldelse = useCallback(async (hytteId, anmeldelseId) => {
    if (!token || token) return;

    //bruker optimistisk oppdatering slik at oppdateringen visuelt skjer med en gang
    setHytteAnmeldelser(prev => prev.filter(a => a.id !== anmeldelseId));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${hytteId}/anmeldelser`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (!response.ok) throw new Error(`Kunne ikke slette anmeldelse: ${response.status}`);
    } catch (err) {
      //tilbakestiller oppdateringen hvis noe går galt
      await hentHytteAnmeldelser(hytteId);
      setError(err.message);
    }
  }, [authHeaders, token, hentHytteAnmeldelser]);


  //Henter automatisk når hytteId er tilgjengelig
  useEffect(() => {
    if (hytteId) hentHytteAnmeldelser(hytteId);
  }, [hentHytteAnmeldelser, hytteId]);

  //Beregner gjennomsnittsrating fra hytteanmeldelseslisten
  const hytteGjennomsnittsrating = hytteAnmeldelser.length > 0
    ? (hytteAnmeldelser.reduce((sum, a) => sum + a.hytte_rating, 0) / hytteAnmeldelser.length).toFixed(1)
    : null;


  /*------------------------------------------------------Turer------------------------------------------------------ */
  //Henter alle anmeldelser for en tur
  const hentTurAnmeldelser = useCallback(async (turId) => {
    setTurAnmeldelser(testdataTur);
    if (!turId || turId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter/${turId}/anmeldelser`);
      if (!response.ok) throw new Error(`Kunne ikke hente turanmeldelser: ${response.status}`);
      const data = await response.json();
      setTurAnmeldelser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  //Legger til en ny anmeldelse for en tur
  const leggTilTurAnmeldelse = useCallback(async (turId, {stjerner, kommentar}) => {
    if (!token) return;
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter/${turId}/anmeldelser`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({stjerner, kommentar})
      });
      if (!response.ok) throw new Error(`Kunne ikke legge til turanmeldelse: ${response.status}`);
      const ny = await response.json();
      setTurAnmeldelser(prev => [ny, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  }, [authHeaders, token]);

  //Sletter en anmeldelse fra en tur
  const slettTurAnmeldelse = useCallback(async (turId, anmeldelseId) => {
    if (!token || token) return;

    //bruker optimistisk oppdatering slik at oppdateringen visuelt skjer med en gang
    setTurAnmeldelser(prev => prev.filter(a => a.id !== anmeldelseId));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter/${turId}/anmeldelser/${anmeldelseId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (!response.ok) throw new Error(`Kunne ikke slette turanmeldelse: ${response.status}`);
    } catch (err) {
      //tilbakestiller oppdateringen hvis noe går galt
      await hentTurAnmeldelser(turId);
      setError(err.message);
    }
  }, [authHeaders, token, hentTurAnmeldelser]);

  //Henter automatisk når turId er tilgjengelig
  useEffect(() => {
    if (turId) hentTurAnmeldelser(turId);
  }, [hentTurAnmeldelser, turId]);

  //Beregner gjennomsnittsrating fra turanmeldelseslisten
  const turGjennomsnittsrating = turAnmeldelser.length > 0
    ? (turAnmeldelser.reduce((sum, a) => sum + a.turrute_rating, 0) / turAnmeldelser.length).toFixed(1)
    : null;

  return {
    hytteAnmeldelser,
    loading,
    error,
    hytteGjennomsnittsrating,
    hentHytteAnmeldelser,
    leggTilHytteAnmeldelse,
    slettHytteAnmeldelse,
    turAnmeldelser,
    turGjennomsnittsrating,
    hentTurAnmeldelser,
    leggTilTurAnmeldelse,
    slettTurAnmeldelse
  };
}
