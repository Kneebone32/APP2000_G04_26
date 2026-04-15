import { useState, useEffect, useCallback, useMemo } from 'react';

//Hook for artikler. Laget av Kay
export function useArtikkel({ autoFetch = false, token = null } = {}) {
    const [artikler, setArtikler] = useState([]);
    const [loading, setLoading] = useState(autoFetch);
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
             const data = await response.json();
             setArtikler(data);
             return data;
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/artikkel/slug/${slug}`);
            if (!response.ok) throw new Error('Kunne ikke hente artikkel');
            return await response.json();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const opprettArtikkel = useCallback(async ({ artikkel_slug, artikkel_tittel, artikkel_innhold }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/artikkel`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ artikkel_slug, artikkel_tittel, artikkel_innhold })
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

    const redigerArtikkel = useCallback(async (id, { artikkel_tittel, artikkel_innhold, artikkel_slug }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/artikkel/${id}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify({ artikkel_tittel, artikkel_innhold, artikkel_slug })
            });
            if (!response.ok) throw new Error('Kunne ikke redigere artikkel');
            setArtikler(prev => prev.map(a => a.artikkel_id === id ? { ...a, artikkel_tittel, artikkel_innhold, artikkel_slug } : a));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authHeaders]);

    const slettArtikkel = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/artikkel/${id}`, {
                method: 'DELETE',
                headers: authHeaders
            });
            if (!response.ok) throw new Error('Kunne ikke slette artikkel');
            setArtikler(prev => prev.filter(a => a.artikkel_id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authHeaders]);

    useEffect(() => {
        if (autoFetch) hentAlleArtikler();
    }, [autoFetch, hentAlleArtikler]);

    return {
        artikler,
        loading,
        error,
        hentAlleArtikler,
        hentArtikkel,
        opprettArtikkel,
        redigerArtikkel,
        slettArtikkel
    };
}