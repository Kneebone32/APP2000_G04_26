import { useState } from "react";
import AnnonseForm from "./annonse-form/AnnonseForm";

// Oppretter en ny annonse. Laget av Olai.
export default function LeggTilAnnonse({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpprett = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            formData 
        }),
      });

      if (!response.ok) {
        throw new Error(`Feil ved opprettelse: ${response.status}`);
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Legg til annonse</h2>
      {loading && <p>Lagrer annonse...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <AnnonseForm
        onSubmitAction={handleOpprett}
        buttonTekst={loading ? "Lagrer..." : "Legg til annonse"}
      />
    </div>
  );
}