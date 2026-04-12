import { useEffect } from "react";
import "./Annonse.css";

// Viser et annonsekort og registrerer visning og klikk. Laget av Olai.
export default function AnnonseKort({ annonse }) {
  // Registrerer en visning når kortet monteres.
  useEffect(() => {
    if (!annonse?.annonse_id) return;
    fetch(`${import.meta.env.VITE_API_URL}/annonser/${annonse.annonse_id}/visning`, {
      method: "POST",
    }).catch(() => {});
  }, [annonse?.annonse_id]);

  // Registrerer et klikk når bruker trykker på annonsen.
  const handleKlikk = () => {
    if (!annonse?.annonse_id) return;
    fetch(`${import.meta.env.VITE_API_URL}/annonser/${annonse.annonse_id}/klikk`, {
      method: "POST",
    }).catch(() => {});
  };

  return (
    <div className="Annonsekort" onClick={handleKlikk}>
      <div className="AnnonseHovedkort">
        {annonse.bilde_url && (
          <img
            src={annonse.bilde_url}
            alt={annonse.tittel || "Annonsebilde"}
            className="Annonsebilde"
          />
        )}

        <div className="AnnonsekortBody">
          <h3 className="AnnonsekortTitle">{annonse.tittel || "Uten tittel"}</h3>
          <p className="AnnonsekortText">{annonse.beskrivelse || ""}</p>
          <p className="AnnonsekortMeta">Annonsør: {annonse.annonse_navn || "Ukjent"}</p>
          {annonse.start_dato && (
            <p className="AnnonsekortMeta">
              Periode: {annonse.start_dato?.slice(0, 10)}
              {" – "}
              {annonse.slutt_dato?.slice(0, 10) || "–"}
            </p>
          )}
          {annonse.sokeord?.length > 0 && (
            <div className="AnnonsekortSøkeord">
              {annonse.sokeord.map(ord => (
                <span key={ord} className="AnnonsekortTag">{ord}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
