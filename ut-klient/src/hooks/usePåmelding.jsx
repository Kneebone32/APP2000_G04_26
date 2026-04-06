import { useState, useCallback, useMemo, useEffect } from 'react';
import { PÅMELDING_STATUS } from '../constants/konstanter';

//Hook til påmeldingssystemet. Laget av Kay med mindre annet er spesifisert
export function usePåmelding({token, aktivitetId = null} = {}) {

    const [aktivitetDatoId, setAktivitetDatoId] = useState(null);
    const [minPåmelding, setMinPåmelding] = useState(null);
    const [deltakerePerDato, setDeltakerePerDato] = useState({});
    const [mineFellesturer, setMineFellesturer] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const authHeaders = useMemo(() => ({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }), [token]);

    //Henter brukerens aktive påmelding for hele fellesturen og auto-velger datoen
    const hentEksisterendePåmelding = useCallback(async (id) => {
        if (!token) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pamelding/fellestur/${id}`, {
                headers: authHeaders
            });
            if (!response.ok) return;
            const data = await response.json();
            if (data?.aktivitet_dato_id) {
                setAktivitetDatoId(data.aktivitet_dato_id);
            }
        } catch {
            //Ingen påmelding funnet
        }
    }, [authHeaders, token]);

    //Henter antall deltakere for alle datoer på en fellestur
    const hentDeltakerePerDato = useCallback(async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pamelding/fellestur/${id}/deltakere`);
            if (!response.ok) throw new Error('Kunne ikke hente deltakere');
            const data = await response.json();
            const map = {};
            for (const rad of data) {
                map[rad.aktivitet_dato_id] = {
                    bindende: Number(rad.bindende),
                    interessert: Number(rad.interessert)
                };
            }
            setDeltakerePerDato(map);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    //Henter innlogget brukers påmelding for en spesifikk dato
    const hentMinPåmelding = useCallback(async (id) => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pamelding/${id}`, {
                headers: authHeaders
            });
            if (!response.ok) throw new Error('Kunne ikke hente påmelding');
            const data = await response.json();
            setMinPåmelding(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [authHeaders, token]);

    //Melder på eller oppdaterer status. setDeltakerePerDato er laget av AI
    const meldPå = useCallback(async (id, status) => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pamelding/${id}`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ status })
            });
            if (!response.ok) {
                const feil = await response.json().catch(() => ({}));
                throw new Error(feil.error ?? 'Kunne ikke melde på');
            }
            const data = await response.json();
            const forrigeStatus = minPåmelding?.pamelding_status ?? null;
            setMinPåmelding(data);
            setDeltakerePerDato(gjeldende => {
                const teller = { ...(gjeldende[id] ?? { bindende: 0, interessert: 0 }) };
                if (forrigeStatus === PÅMELDING_STATUS.BINDENDE) teller.bindende = Math.max(0, teller.bindende - 1);
                else if (forrigeStatus === PÅMELDING_STATUS.INTERESSERT) teller.interessert = Math.max(0, teller.interessert - 1);
                if (status === PÅMELDING_STATUS.BINDENDE) teller.bindende += 1;
                else if (status === PÅMELDING_STATUS.INTERESSERT) teller.interessert += 1;
                return { ...gjeldende, [id]: teller };
            });
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authHeaders, token, minPåmelding]);

    //Henter fellesturer der bruker er påmeldt (interessert eller bindende)
    const hentMineFellesturer = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pamelding/mine`, {
                headers: authHeaders
            });
            if (!response.ok) throw new Error('Kunne ikke hente dine fellesturer');
            const data = await response.json();
            setMineFellesturer(data ?? []);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [authHeaders, token]);

    //Henter alle deltakere på en spesifikk dato
    const hentDeltakereForDato = useCallback(async (datoId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pamelding/${datoId}/deltakere`);
            if (!response.ok) throw new Error('Kunne ikke hente deltakere for dato');
            return await response.json();
        } catch (err) {
            setError(err.message);
        }
    }, []);

    //Melder av. setDeltakerePerDato er laget av AI
    const meldAv = useCallback(async (id) => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pamelding/${id}`, {
                method: 'DELETE',
                headers: authHeaders
            });
            if (!response.ok) throw new Error('Kunne ikke melde av');
            const forrigeStatus = minPåmelding?.pamelding_status ?? null;
            setMinPåmelding(gjeldende => gjeldende ? {...gjeldende, pamelding_status: PÅMELDING_STATUS.AVMELDT} : null);
            setDeltakerePerDato(gjeldende => {
                const teller = { ...(gjeldende[id] ?? { bindende: 0, interessert: 0 }) };
                if (forrigeStatus === PÅMELDING_STATUS.BINDENDE) teller.bindende = Math.max(0, teller.bindende - 1);
                else if (forrigeStatus === PÅMELDING_STATUS.INTERESSERT) teller.interessert = Math.max(0, teller.interessert - 1);
                return { ...gjeldende, [id]: teller };
            });
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authHeaders, token, minPåmelding]);

    //Henter deltakere per dato og auto-velger eksisterende påmelding
    useEffect(() => {
        if (!aktivitetId) return;
        hentDeltakerePerDato(aktivitetId);
        if (token) hentEksisterendePåmelding(aktivitetId);
    }, [aktivitetId, token, hentDeltakerePerDato, hentEksisterendePåmelding]);

    //Henter brukerens påmelding når en dato velges
    useEffect(() => {
        if (!aktivitetDatoId || !token) return;
        hentMinPåmelding(aktivitetDatoId);
    }, [aktivitetDatoId, token, hentMinPåmelding]);

    return {
        aktivitetDatoId,
        setAktivitetDatoId,
        minPåmelding,
        mineFellesturer,
        deltakerePerDato,
        loading,
        error,
        hentMinPåmelding,
        hentMineFellesturer,
        hentDeltakereForDato,
        meldPå,
        meldAv
    };
}
