import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

const testVarsler = [
    { varsel_id: 99, tittel: 'Velkommen til UT.ut!', varsel_kategori: 'info', status: 'ulest', opprettet_tid: new Date().toISOString(), innhold: 'Takk for at du registrerte deg. Utforsk turer, hytter og fellesturer i nærheten av deg.' }
];

//Hook til varslingssystemet. Laget av Kay
export function useVarsler({ token, pollIntervall = 10000, autoPoll = false } = {}) {

    const [varsler, setVarsler] = useState([]);
    const [valgtVarsel, setValgtVarsel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const intervallRef = useRef(null);

    const authHeaders = useMemo(() => ({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }), [token]);

    //Henter alle varsler for innlogget bruker
    const hentVarsler = useCallback(async () => {
        if (!token) return;
        try {
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/varsler`, {
                headers: authHeaders
            });
            if (!response.ok) throw new Error(`HTTP feil: ${response.status}`);
            const data = await response.json();
            setVarsler([...testVarsler, ...data]);
        } catch (err) {
            setError(err.message);
        }
    }, [authHeaders, token]);

    //Henter ett varsel ut fra varselId
    const hentVarsel = useCallback(async (varselId) => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/varsler/${varselId}`, {
                headers: authHeaders
            });
            if (!response.ok) throw new Error('Kunne ikke hente varselet');
            const data = await response.json();
            setValgtVarsel(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [authHeaders, token]);

    //Merker et varsel som lest
    const merkSomLest = useCallback(async (varselId) => {
        if (!token) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/varsler/${varselId}/lest`, {
                method: 'PATCH',
                headers: authHeaders
            });
            if (!response.ok) throw new Error('Kunne ikke merke varsel som lest');
            setVarsler((forrige) =>
                forrige.map((varsel) => varsel.varsel_id === varselId ? { ...varsel, status: 'lest' } : varsel)
            );
        } catch (err) {
            setError(err.message);
        }
    }, [authHeaders, token]);

    //Behandler en oppgave
    const behandleOppgave = useCallback(async (varselId, beslutning) => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/varsler/${varselId}/behandle`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({beslutning})
            });
            if (!response.ok) throw new Error('Kunne ikke behandle oppgaven');
            setVarsler((forrige) =>
                forrige.map((v) => v.varsel_id === varselId ? {...v, status: beslutning} : v)
            );
            setValgtVarsel((forrige) => forrige ? {...forrige, status: beslutning} : null);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authHeaders, token]);

    const stopPoll = useCallback(() => {
        if (intervallRef.current) {
            clearInterval(intervallRef.current);
            intervallRef.current = null;
        }
    }, []);

    const startPoll = useCallback((pollFunc) => {
        stopPoll();
        pollFunc();
        intervallRef.current = setInterval(pollFunc, pollIntervall);
    }, [pollIntervall, stopPoll]);

    useEffect(() => {
        if (autoPoll && token) {
            startPoll(hentVarsler);
        }
        return () => stopPoll();
    }, [autoPoll, token, hentVarsler, startPoll, stopPoll]);

    return {
        varsler,
        valgtVarsel,
        setValgtVarsel,
        loading,
        error,
        hentVarsler,
        hentVarsel,
        merkSomLest,
        behandleOppgave,
        startPoll,
        stopPoll
    };
}
