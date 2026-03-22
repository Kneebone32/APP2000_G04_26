import "./Annonse.css";

// Viser et enkelt annonsekort. Laget av Olai.
export default function AnnonseKort({ annonse }) {
  return (
    <div className="Annonsekort">
      <div className="AnnonseHovedkort">
        {annonse.bildeUrl && (
          <img
            src={annonse.bildeUrl}
            alt={annonse.tittel || "Annonsebilde"}
            className="Annonsebilde"
          />
        )}

        <div className="AnnonsekortBody">
          <h3 className="AnnonsekortTitle">{annonse.tittel || "Uten tittel"}</h3>
          <p className="AnnonsekortText">{annonse.beskrivelse || annonse.tekst || ""}</p>
          <p className="AnnonsekortMeta">Annonser: {annonse.annonserNavn || "Ukjent"}</p>
          <p className="AnnonsekortMeta">Kategori: {annonse.kategori || "-"}</p>
        </div>
      </div>
    </div>
  );
}