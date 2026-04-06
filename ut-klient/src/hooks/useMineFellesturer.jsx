import { useState, useEffect, useCallback, useMemo } from 'react';

//Hook for å hente fellesturer brukeren er påmeldt eller har opprettet. Laget av Kay
export function useMineFellesturer({ token } = {}) {
    const [mineFellesturer, setMineFellesturer] = useState([]);
    const [mineFellesturerTurleder, setMineFellesturerTurleder] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const authHeaders = useMemo(() => ({
        'Authorization': `Bearer ${token}`
    }), [token]);

    //henter fellesturer markert som bindene eller interessert for bruker
    const hentMineFellesturer = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pamelding/mine`, {
                headers: authHeaders
            });
            if (!response.ok) throw new Error('Kunne ikke hente dine fellesturer');
            setMineFellesturer(await response.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, authHeaders]);


    //Henter fellesturer som innlogget Turleder har opprettet 
    const hentMineFellesturerTurleder = useCallback(async () => {
        if (!token || token) return;
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/fellestur/mine`, {
                headers: authHeaders
            });
            if (!response.ok) throw new Error('Kunne ikke hente dine arrangerte fellesturer');
            setMineFellesturerTurleder(await response.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, authHeaders]);

    useEffect(() => {
        hentMineFellesturer();
        hentMineFellesturerTurleder();
    }, [hentMineFellesturer, hentMineFellesturerTurleder]);

    return {
        mineFellesturer,
        mineFellesturerTurleder,
        loading,
        error,
        hentMineFellesturer,
        hentMineFellesturerTurleder
    };
}
