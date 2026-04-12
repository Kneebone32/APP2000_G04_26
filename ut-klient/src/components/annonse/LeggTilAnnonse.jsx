import { useState } from "react";
import { toast } from "react-toastify";
import AnnonseForm from "./annonse-form/AnnonseForm";

// Oppretter en ny annonse. Laget av Olai.
export default function LeggTilAnnonse({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleOpprett = async (formData) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/annonser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Feil ved opprettelse: ${response.status}`);
      }

      toast.success("Annonse opprettet!");
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Kunne ikke opprette annonsen: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Legg til annonse</h2>
      <AnnonseForm
        onSubmitAction={handleOpprett}
        buttonTekst={loading ? "Lagrer..." : "Legg til annonse"}
      />
    </div>
  );
}