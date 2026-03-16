import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

//Hook til meldingssystemet. Laget av Kay
export function useMeldinger({ token, pollIntervall = 5000 } = {}) {

  const [meldinger, setMeldinger] = useState([]);
  const [samtaler, setSamtaler] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervallRef = useRef(null);

  const authHeaders = useMemo(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);

  //Henter alle privatsamtaler for innlogget bruker
  const hentSamtaler = useCallback(async () => {
    if (!token) return;
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meldinger/samtaler`, {
        headers: authHeaders
      });
      if (!response.ok) throw new Error(`HTTP feil: ${response.status}`);
      const data = await response.json();
      setSamtaler(data);
    } catch (err) {
      setError(err.message);
    }
  }, [authHeaders, token]);

  //Henter meldinger i en privatsamtale med en spesifikk bruker
  const hentSamtale = useCallback(async (mottakerId) => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meldinger/pm/${mottakerId}`, {
        headers: authHeaders
      });
      if (!response.ok) throw new Error("Kunne ikke hente samtalen");
      const data = await response.json();
      setMeldinger(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, token]);

  //Sender en privatmelding til en bruker
  const sendMelding = useCallback(async (mottakerId, innhold) => {
    if (!token) return;
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meldinger/pm`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ mottaker_id: mottakerId, innhold })
      });
      if (!response.ok) throw new Error("Kunne ikke sende melding");
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [authHeaders, token]);

  //henter meldinger i en gruppesamtale
  const hentGruppeMeldinger = useCallback(async (fellesturId) => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meldinger/gruppe/${fellesturId}`, {
        headers: authHeaders
      });
      if (!response.ok) throw new Error("Kunne ikke hente gruppemeldinger");
      const data = await response.json();
      setMeldinger(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, token]);

  //Sender en melding til en gruppesamtale
  const sendGruppeMelding = useCallback(async (fellesturId, innhold) => {
    if (!token) return;
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meldinger/gruppe`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ fellestur_id: fellesturId, innhold })
      });
      if (!response.ok) throw new Error("Kunne ikke sende gruppemelding");
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [authHeaders, token]);

  //Merker en melding som lest
  const merkSomLest = useCallback(async (meldingId) => {
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meldinger/${meldingId}/lest`, {
        method: 'PATCH',
        headers: authHeaders
      });
      if (!response.ok) throw new Error("Kunne ikke merke melding som lest");
    } catch (err) {
      setError(err.message);
    }
  }, [authHeaders, token]);

  const stopPoll = useCallback(() => {
    if (intervallRef.current) {
      clearInterval(intervallRef.current);
      intervallRef.current = null;
    }
  }, []);

  //Starter polling for å holde samtaler oppdatert. Laget med mye hjelp fra internett + AI
  const startPoll = useCallback((pollFunc) => {
    stopPoll();
    pollFunc();
    intervallRef.current = setInterval(pollFunc, pollIntervall);
  }, [pollIntervall, stopPoll]);

  useEffect(() => {
    return () => stopPoll();
  }, [stopPoll]);

  return {
    meldinger,
    samtaler,
    loading,
    error,
    hentSamtaler,
    hentSamtale,
    sendMelding,
    hentGruppeMeldinger,
    sendGruppeMelding,
    merkSomLest,
    startPoll,
    stopPoll
  };
}
