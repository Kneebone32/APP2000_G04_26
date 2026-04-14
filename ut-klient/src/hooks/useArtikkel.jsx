import { useState, useEffect, useCallback, useMemo } from 'react';

//TODO: fjern testdata når backend er klar. Testdata fra AI
const TEST_ARTIKLER = [
    {
        artikkel_id: 1,
        artikkel_slug: 'om-oss',
        artikkel_tittel: 'Om oss',
        artikkel_innhold: '## Hvem er vi?\n\nVi er en gjeng friluftsfolk som elsker å utforske norsk natur.\n\n## Vårt mål\n\nGjøre det enkelt å finne og dele turer, hytter og fellesopplevelser.'
    },
    {
        artikkel_id: 2,
        artikkel_slug: 'kontakt',
        artikkel_tittel: 'Kontakt oss',
        artikkel_innhold: '## Kontaktinformasjon\n\nHar du spørsmål? Ta gjerne kontakt!\n\n- **E-post:** kontakt@eksempel.no\n- **Telefon:** 123 45 678'
    },
    {
        artikkel_id: 3,
        artikkel_slug: 'faq',
        artikkel_tittel: 'Ofte stilte spørsmål',
        artikkel_innhold: '## FAQ\n\n**Kan jeg registrere meg gratis?**\nJa, det er helt gratis å opprette bruker.\n\n**Hvordan melder jeg meg på en fellestur?**\nGå til fellestur-siden og trykk "Meld meg på".'
    }
];

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
        setArtikler(TEST_ARTIKLER);
        return TEST_ARTIKLER;
        // TODO: bytt til dette når backend er klar:
        // try {
        //     setLoading(true);
        //     setError(null);
        //     const response = await fetch(`${import.meta.env.VITE_API_URL}/artikkel`);
        //     if (!response.ok) throw new Error('Kunne ikke hente artikler');
        //     const data = await response.json();
        //     setArtikler(data);
        //     return data;
        // } catch (err) {
        //     setError(err.message);
        // } finally {
        //     setLoading(false);
        // }
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

    const redigerArtikkel = useCallback(async (slug, { artikkel_tittel, artikkel_innhold }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/artikkel/${slug}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify({ artikkel_tittel, artikkel_innhold })
            });
            if (!response.ok) throw new Error('Kunne ikke redigere artikkel');
            const oppdatert = await response.json();
            setArtikler(prev => prev.map(a => a.artikkel_slug === slug ? oppdatert : a));
            return oppdatert;
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
            setArtikler(prev => prev.filter(a => a.artikkel_slug !== slug));
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