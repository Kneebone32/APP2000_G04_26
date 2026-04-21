import { useState, useCallback } from "react";

//Hook for admin-operasjoner. Laget av Kay.
export function useAdmin({ token } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tilbakestillDB = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/tilbakestill`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Feil ved tilbakestilling: ${response.status}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { tilbakestillDB, loading, error };
}
