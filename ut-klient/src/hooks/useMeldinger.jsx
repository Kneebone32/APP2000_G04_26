import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

//Hook til meldingssystemet. Laget av Kay
export function useMeldinger({token, pollIntervall = 5000, autoPoll = false} = {}) {

  const [meldinger, setMeldinger] = useState([]);
  const [samtaler, setSamtaler] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervallRef = useRef(null);

  const authHeaders = useMemo(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }), [token]);

  //Henter alle samtaler for innlogget bruker
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

  //Henter meldinger i en samtale (brukeren må være medlem)
  const hentMeldinger = useCallback(async (samtaleId) => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meldinger/samtale/${samtaleId}/meldinger`, {
        headers: authHeaders
      });
      if (!response.ok) throw new Error("Kunne ikke hente meldinger");
      const data = await response.json();
      setMeldinger(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, token]);

  //Finner eller oppretter en direktesamtale med en annen bruker
  const hentEllerOpprettDirekte = useCallback(async (annenBrukerId) => {
    if (!token) return;
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meldinger/samtale/direkte`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ annen_bruker_id: annenBrukerId })
      });
      if (!response.ok) throw new Error("Kunne ikke opprette direktesamtale");
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [authHeaders, token]);

  //Oppretter en ny gruppesamtale
  const opprettSamtale = useCallback(async (brukerIds, samtalenavn = null) => {
    if (!token) return;
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meldinger/samtale`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ bruker_ids: brukerIds, samtale_navn: samtalenavn })
      });
      if (!response.ok) throw new Error("Kunne ikke opprette samtale");
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [authHeaders, token]);

  //Forlater en gruppesamtale
  const forlatSamtale = useCallback(async (samtaleId) => {
    if (!token) return;
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meldinger/${samtaleId}/forlat`, {
        method: 'PUT',
        headers: authHeaders
      });
      if (!response.ok) throw new Error('Kunne ikke forlate samtalen');
      setSamtaler(prev => prev.filter(s => s.samtale_id !== samtaleId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [authHeaders, token]);

  //Sender en melding i en samtale
  const sendMelding = useCallback(async (samtaleId, meldingTekst, bildeUrl = null) => {
    if (!token) return;
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meldinger/melding`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({samtale_id: samtaleId, melding_tekst: meldingTekst, bilde_url: bildeUrl})
      });
      if (!response.ok) throw new Error("Kunne ikke sende melding");
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
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
    if (autoPoll && token) {
      startPoll(hentSamtaler);
    }
    return () => stopPoll();
  }, [autoPoll, token, hentSamtaler, startPoll, stopPoll]);

  return {
    meldinger,
    samtaler,
    loading,
    error,
    hentSamtaler,
    hentMeldinger,
    hentEllerOpprettDirekte,
    opprettSamtale,
    sendMelding,
    forlatSamtale,
    startPoll,
    stopPoll
  };
}
