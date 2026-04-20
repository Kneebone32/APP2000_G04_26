import { useState, useCallback, useMemo, useEffect } from "react";

//Hook for å håndtere anmeldelser for hytter og turer. Laget av Kay
export function useAnmeldelser({ token, hytteId, turId } = {}) {
  const [hytteAnmeldelser, setHytteAnmeldelser] = useState([]);
  const [turAnmeldelser, setTurAnmeldelser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token],
  );

  /*------------------------------------------------------Hytter------------------------------------------------------ */
  //Henter alle anmeldelser for en hytte
  const hentHytteAnmeldelser = useCallback(async (hytteId) => {
    if (!hytteId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/anmeldelser/hytte/${hytteId}`);
      if (!response.ok) throw new Error(`Kunne ikke hente anmeldelser: ${response.status}`);
      const data = await response.json();
      setHytteAnmeldelser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  //Legger til en ny anmeldelse for en hytte
  const leggTilHytteAnmeldelse = useCallback(
    async (hytteId, { rating, anmeldelse }, brukerNavn, brukerId) => {
      if (!token) return;
      try {
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/anmeldelser/hytte/${hytteId}`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ rating, anmeldelse }),
        });
        if (!response.ok) throw new Error(`Kunne ikke legge til anmeldelse: ${response.status}`);
        const ny = {
          bruker_id: brukerId,
          bruker_navn: brukerNavn,
          hytte_rating: rating,
          hytte_anmeldelse: anmeldelse,
          hytte_opprettet_tidspunkt: new Date().toISOString(),
        };
        setHytteAnmeldelser((prev) => [ny, ...prev]);
      } catch (err) {
        setError(err.message);
      }
    },
    [authHeaders, token],
  );

  //Sletter en anmeldelse fra en hytte
  const slettHytteAnmeldelse = useCallback(
    async (hytteId, brukerId) => {
      if (!token) return;

      //bruker optimistisk oppdatering slik at oppdateringen visuelt skjer med en gang
      setHytteAnmeldelser((prev) => prev.filter((a) => a.bruker_id !== brukerId));
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/anmeldelser/hytte/${hytteId}`, {
          method: "DELETE",
          headers: authHeaders,
        });
        if (!response.ok) throw new Error(`Kunne ikke slette anmeldelse: ${response.status}`);
      } catch (err) {
        //tilbakestiller oppdateringen hvis noe går galt
        await hentHytteAnmeldelser(hytteId);
        setError(err.message);
      }
    },
    [authHeaders, token, hentHytteAnmeldelser],
  );

  //Henter automatisk når hytteId er tilgjengelig
  useEffect(() => {
    if (hytteId) hentHytteAnmeldelser(hytteId);
  }, [hentHytteAnmeldelser, hytteId]);

  //Beregner gjennomsnittsrating fra hytteanmeldelseslisten
  const hytteGjennomsnittsrating =
    hytteAnmeldelser.length > 0
      ? (hytteAnmeldelser.reduce((sum, a) => sum + a.hytte_rating, 0) / hytteAnmeldelser.length).toFixed(1)
      : null;

  /*------------------------------------------------------Turer------------------------------------------------------ */
  //Henter alle anmeldelser for en tur
  const hentTurAnmeldelser = useCallback(async (turId) => {
    if (!turId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/anmeldelser/tur/${turId}`);
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
  const leggTilTurAnmeldelse = useCallback(
    async (turId, { rating, anmeldelse }, brukerNavn, brukerId) => {
      if (!token) return;
      try {
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/anmeldelser/tur/${turId}`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ rating, anmeldelse }),
        });
        if (!response.ok) throw new Error(`Kunne ikke legge til turanmeldelse: ${response.status}`);
        const ny = {
          bruker_id: brukerId,
          bruker_navn: brukerNavn,
          rating,
          anmeldelse,
          opprettet_tidspunkt: new Date().toISOString(),
        };
        setTurAnmeldelser((prev) => [ny, ...prev]);
      } catch (err) {
        setError(err.message);
      }
    },
    [authHeaders, token],
  );

  //Sletter en anmeldelse fra en tur
  const slettTurAnmeldelse = useCallback(
    async (turId, brukerId) => {
      if (!token) return;

      //bruker optimistisk oppdatering slik at oppdateringen visuelt skjer med en gang
      setTurAnmeldelser((prev) => prev.filter((a) => a.bruker_id !== brukerId));
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/anmeldelser/tur/${turId}`, {
          method: "DELETE",
          headers: authHeaders,
        });
        if (!response.ok) throw new Error(`Kunne ikke slette turanmeldelse: ${response.status}`);
      } catch (err) {
        //tilbakestiller oppdateringen hvis noe går galt
        await hentTurAnmeldelser(turId);
        setError(err.message);
      }
    },
    [authHeaders, token, hentTurAnmeldelser],
  );

  //Henter automatisk når turId er tilgjengelig
  useEffect(() => {
    if (turId) hentTurAnmeldelser(turId);
  }, [hentTurAnmeldelser, turId]);

  //Beregner gjennomsnittsrating fra turanmeldelseslisten
  const turGjennomsnittsrating =
    turAnmeldelser.length > 0 ? (turAnmeldelser.reduce((sum, a) => sum + a.rating, 0) / turAnmeldelser.length).toFixed(1) : null;

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
    slettTurAnmeldelse,
  };
}
