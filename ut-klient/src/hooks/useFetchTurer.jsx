import { useState, useEffect } from 'react';

export function useFetchTurer(autoFetch = true) {
  const [turer, setTurer] = useState([]);
  const [loadingTurer, setLoadingTurer] = useState(autoFetch);
  const [errorTurer, setErrorTurer] = useState(null);

  const fetchTurer = async () => {
    try {
      setLoadingTurer(true);
      setErrorTurer(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter`);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setTurer(data);
    } catch (err) {
      setErrorTurer(err.message);
    } finally {
      setLoadingTurer(false);
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
    loadingTurer, 
    errorTurer, 
    refetch: fetchTurer,
    deleteTur 
  };
}