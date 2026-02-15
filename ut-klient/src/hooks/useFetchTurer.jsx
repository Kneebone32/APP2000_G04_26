import { useState, useEffect } from 'react';

export function useFetchTurer(autoFetch = true) {
  const [turer, setTurer] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchTurer = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turer`);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setTurer(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTurer();
    }
  }, [autoFetch]);


  const deleteTur = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turer/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error ved sletting: ${response.status}`);
      }

      setTurer(prevTur => prevTur.filter(tur => tur.tur_id !== id));
      
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return { 
    turer, 
    loading, 
    error, 
    refetch: fetchTurer,
    deleteTur 
  };
}