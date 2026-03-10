import { useState, useEffect, useCallback } from 'react';

//Hook til autentisering av bruker. Laget av Kay
export function useAutentisering({autoFetch = true} = {}) {
  const [bruker, setBruker] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);


  //Henter profil ut fra token
  const fetchProfil = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bruker/meg`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Uautorisert');
      }

      const data = await response.json();
      setBruker(data.bruker);
    } catch (err) {
      setError(err.message);
      setToken(null);
      setBruker(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, [token]);


  //Innlogging
  const logginn = useCallback(async (bruker_epost, bruker_passord) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/bruker/logginn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bruker_epost, bruker_passord })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Logg inn feilet');
      }

      const data = await response.json();
      setToken(data.token);
      setBruker(data.bruker);
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  //registrer ny bruker
  const registrer = useCallback(async (bruker_navn, bruker_etternavn, bruker_epost, bruker_passord) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/bruker/registrer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bruker_navn, bruker_etternavn, bruker_epost, bruker_passord })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'registrering feilet');
      }

      const data = await response.json();
      setToken(data.token);
      setBruker(data.bruker);
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  //Logg ut
  const loggut = useCallback(() => {
    setToken(null);
    setBruker(null);
    localStorage.removeItem('token');
  }, []);


  //autofetch hvis token eksisterer
  useEffect(() => {
    if (autoFetch && token) {
      fetchProfil();
    } else if (autoFetch) {
      setLoading(false);
    }
  }, [autoFetch, fetchProfil, token]);

  return {
    bruker,
    token,
    loading,
    error,
    erAutentisert: !!bruker, 
    logginn,
    registrer,
    loggut,
    refetch: fetchProfil
  };
}