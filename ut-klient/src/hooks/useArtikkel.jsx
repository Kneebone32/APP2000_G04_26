import { useState, useCallback, useMemo } from 'react';

//Hook for artikler. Laget av Kay
export function useArtikkel({ token = null } = {}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const authHeaders = useMemo(() => ({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }), [token]);

    const hentAlleArtikler = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/artikkel`);
            if (!response.ok) throw new Error('Kunne ikke hente artikler');
            return await response.json();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const hentArtikkel = useCallback(async (slug) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/artikkel/${slug}`);
            if (!response.ok) throw new Error('Kunne ikke hente artikkel');
            return await response.json();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const opprettArtikkel = useCallback(async ({artikkel_slug, artikkel_tittel, artikkel_innhold}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/artikkel`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({artikkel_slug, artikkel_tittel, artikkel_innhold})
            });
            if (!response.ok) throw new Error('Kunne ikke opprette artikkel');
            return await response.json();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authHeaders]);

    const redigerArtikkel = useCallback(async (slug, {artikkel_tittel, artikkel_innhold}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/artikkel/${slug}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify({artikkel_tittel, artikkel_innhold})
            });
            if (!response.ok) throw new Error('Kunne ikke redigere artikkel');
            return await response.json();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authHeaders]);

    const slettArtikkel = useCallback(async (slug) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/artikkel/${slug}`, {
                method: 'DELETE',
                headers: authHeaders
            });
            if (!response.ok) throw new Error('Kunne ikke slette artikkel');
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authHeaders]);

    return {
        loading,
        error,
        hentAlleArtikler,
        hentArtikkel,
        opprettArtikkel,
        redigerArtikkel,
        slettArtikkel
    };
}