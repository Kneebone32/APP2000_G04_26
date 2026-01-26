import { useState, useEffect } from 'react';

export function FetchHytter(autoFetch = true) {
  const [hytter, setHytter] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchHytter = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter`);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setHytter(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchHytter();
    }
  }, [autoFetch]);


  const deleteHytte = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error ved sletting: ${response.status}`);
      }

      setHytter(prevHytte => prevHytte.filter(hytte => hytte.id !== id));
      
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return { 
    hytter, 
    loading, 
    error, 
    refetch: fetchHytter,
    deleteHytte 
  };
}