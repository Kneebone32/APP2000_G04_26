import { toast } from "react-toastify";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useFetchAnnonser } from "../../hooks/useFetchAnnonser";
import AnnonseForm from "./annonse-form/AnnonseForm";

// Oppretter en ny annonse. Laget av Olai.
export default function LeggTilAnnonse({ onSuccess }) {
  const { token } = useAutentisering({ autoFetch: true });
  const { opprettAnnonse, loadingAnnonser: loading } = useFetchAnnonser({ token });

  const handleOpprett = async (formData) => {
    try {
      await opprettAnnonse(formData);
      toast.success("Annonse opprettet!");
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Kunne ikke opprette annonsen: " + err.message);
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
