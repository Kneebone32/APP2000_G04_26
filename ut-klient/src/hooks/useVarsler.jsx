import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

const testVarsler = [
    { varsel_id: 99, tittel: 'Velkommen til UT.ut![test]', varsel_kategori: 'info', type_navn: null, status: 'ulest', opprettet_tidspunkt: new Date().toISOString(), innhold: 'Takk for at du registrerte deg. Utforsk turer, hytter og fellesturer i nærheten av deg.' },
    { varsel_id: 200, tittel: 'Forespørsel om rolleendring[test]', varsel_kategori: 'oppgave', type_navn: 'rolle_foresporsel', status: 'ulest', opprettet_tidspunkt: '2026-03-23T09:00:00.000Z', innhold: 'Bruker Ola Nordmann (ola@example.com) har bedt om å bli annonsør.' },
    { varsel_id: 201, tittel: 'Ny fellestur bruker hytten din[test]', varsel_kategori: 'oppgave', type_navn: 'hytteeier_ny_fellestur', status: 'ulest', opprettet_tidspunkt: '2026-04-01T10:00:00.000Z', innhold: 'En fellestur planlegger å bruke hytten din. Bekreft om du har plass. Dato: 27.04.2026, Antall: 8' },
    { varsel_id: 202, tittel: 'Booking av hytten din[test]', varsel_kategori: 'oppgave', type_navn: 'hytteeier_booking', status: 'ulest', opprettet_tidspunkt: '2026-04-02T12:00:00.000Z', innhold: 'Noen ønsker å booke hytten din. Bekreft eller avslå bookingen. Dato: 27.04.2026, Antall: 8' },
];

//Hook til varslingssystemet. Laget av Kay
export function useVarsler({token, pollIntervall = 10000, autoPoll = false} = {}) {

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

    //Oppretter et info-varsel
    const sendInfoVarsel = useCallback(async ({mottaker_id, type_navn, tittel, innhold, referanse_type, referanse_id}) => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/varsler/info`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ mottaker_id, type_navn, tittel, innhold, referanse_type, referanse_id })
            });
            if (!response.ok) {
                const feil = await response.json().catch(() => ({}));
                throw new Error(feil.error ?? 'Kunne ikke sende varsel');
            }
            return await response.json();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authHeaders, token]);

    //Sletter et varsel
    const slettVarsel = useCallback(async (varselId) => {
        if (!token) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/varsler/${varselId}`, {
                method: 'DELETE',
                headers: authHeaders
            });
            if (!response.ok) throw new Error('Kunne ikke slette varsel');
            setVarsler((forrige) => forrige.filter((v) => v.varsel_id !== varselId));
            setValgtVarsel(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [authHeaders, token]);

    //Behandler en oppgave. optimistisk oppdatering ble kaotisk. refactor hvis tid
    const behandleOppgave = useCallback(async (varselId, beslutning) => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/varsler/${varselId}/behandle`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({beslutning: beslutning === 'godtatt'})
            });
            if (!response.ok) throw new Error('Kunne ikke behandle oppgaven');
            const nyForespørselStatus = beslutning === 'godtatt' ? 'godkjent' : 'avslatt';
            setVarsler((forrige) =>
                forrige.map((varsel) => varsel.varsel_id === varselId
                    ? {...varsel, status: 'behandlet', foresporsel_status: nyForespørselStatus}
                    : varsel)
            );
            setValgtVarsel((forrige) => forrige
                ? {...forrige, status: 'behandlet', foresporsel_status: nyForespørselStatus}
                : null);
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

    //Starter polling for å holde varsler oppdatert. Laget med mye hjelp fra internett + AI
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
        sendInfoVarsel,
        slettVarsel,
        behandleOppgave,
        startPoll,
        stopPoll
    };
}
