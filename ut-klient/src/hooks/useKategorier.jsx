import { useState, useEffect, useMemo } from 'react';

//Henter alle kategorier av informasjon om hytter, turmål, etc. Eks. fasiliteter, tilgjengelighet
export const useKategorier = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKategorier = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/metadata/kategorier`);
                if (!response.ok) throw new Error("Kunne ikke hente kategorier");

                const result = await response.json();
                setData(result);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchKategorier();
    }, []);

    //standardnavn: accumulator (acc), current value (curr)
    //bruker useMemo for å ikke kjøre den hver render
    const kategorier = useMemo(() => {
        return data.reduce((acc, curr) => {
            const nøkkel = curr.kategori_navn.toLowerCase().replace(/\s+/g, '_'); //legger til understrek i passer_for
            acc[nøkkel] = curr.informasjon;
            return acc;
        }, {});
    }, [data]);

    return { kategorier, loading, error };
};