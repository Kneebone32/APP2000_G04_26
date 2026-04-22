import { useState, useEffect, useCallback, useMemo } from "react";

// Hook til turruter. Laget av Olai med mindre annet er spesifisert
export function useFetchTurer({ autoFetch = false, hentTurID = null, hentTurRuteID = null, turKort = null, token = null } = {}) {
  const [turer, setTurer] = useState([]);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token],
  );

  const [loadingTurer, setLoadingTurer] = useState();
  const [errorTurer, setErrorTurer] = useState(null);
  const [turDetaljer, setTurDetaljer] = useState(null);

  // Henter alle turrutene
  const fetchTurer = useCallback(async () => {
    try {
      setLoadingTurer(true);
      setErrorTurer(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tur`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setTurer(data);
    } catch (err) {
      setErrorTurer(err.message);
    } finally {
      setLoadingTurer(false);
    }
  }, []);

  // Henter populære turer sortert etter kombinasjon av snittrating og antall anmeldelser - Laget av AI
  const fetchPopulaereTurer = useCallback(async (grense = 4) => {
    try {
      setLoadingTurer(true);
      setErrorTurer(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tur/populaere?grense=${grense}`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return await response.json();
    } catch (err) {
      setErrorTurer(err.message);
      return [];
    } finally {
      setLoadingTurer(false);
    }
  }, []);

  // Henter en kortversjon av turruter til kortvisning/lister.
  const fetchTurKort = useCallback(async () => {
    try {
      setLoadingTurer(true);
      setErrorTurer(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tur/kort`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      setTurer(data);
    } catch (err) {
      setErrorTurer(err.message);
    } finally {
      setLoadingTurer(false);
    }
  }, []);

  // Legger til en ny turrute
  const opprettTur = useCallback(
    async (data) => {
      try {
        setLoadingTurer(true);
        setErrorTurer(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/tur`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(`Feil ved opprettelse: ${response.status}`);

        return await response.json();
      } catch (err) {
        setErrorTurer(err.message);
        throw err;
      } finally {
        setLoadingTurer(false);
      }
    },
    [authHeaders],
  );

  // Oppdaterer en turrute
  const oppdaterTur = useCallback(
    async (id, data) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tur/${id}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Feil ved oppdatering: ${response.status}`);
        }

        const result = await response.json();
        setTurer((prevTurer) => prevTurer.map((tur) => (tur.turrute_id === parseInt(id) ? { ...tur, ...data } : tur)));
        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    [authHeaders],
  );

  // Sletter en turrute
  const deleteTur = useCallback(
    async (id) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tur/${id}`, {
          method: "DELETE",
          headers: authHeaders,
        });

        if (!response.ok) {
          throw new Error(`Error ved sletting: ${response.status}`);
        }

        setTurer((prevTur) => prevTur.filter((tur) => tur.turrute_id !== id));

        return await response.json();
      } catch (err) {
        throw new Error(err.message);
      }
    },
    [authHeaders],
  );

  // Henter en turrute basert på ID
  const hentTurFraId = useCallback(async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tur/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setTurDetaljer(data);
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  }, []);

  // Henter rutepunkter for en tur basert på ID
  const hentPunkterFraId = useCallback(async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter/${id}/punkter`);
    return response.ok ? response.json() : [];
  }, []);

  // Kjører valgte hentefunksjoner automatisk ut fra hook-innstillingene.
  useEffect(() => {
    if (autoFetch) fetchTurer();
    if (hentTurID) hentTurFraId(hentTurID);
    if (turKort) fetchTurKort();
  }, [autoFetch, hentTurID, hentTurRuteID, turKort, fetchTurer, hentTurFraId, fetchTurKort]);

  return {
    turer,
    turDetaljer,
    loadingTurer,
    errorTurer,
    refetch: fetchTurer,
    fetchTurKort,
    fetchPopulaereTurer,
    opprettTur,
    deleteTur,
    oppdaterTur,
    hentTurFraId,
    hentPunkterFraId,
  };
}
