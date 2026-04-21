import { useFetchAnnonser } from "../../hooks/useFetchAnnonser";
import "./Annonse.css";

// Viser et annonsekort og registrerer visning og klikk. Laget av Olai.
export default function AnnonseKort({ annonse }) {
  const { registrerKlikk } = useFetchAnnonser({ registrerVisningId: annonse?.annonse_id });

  return (
    <div className="Annonsekort" onClick={() => registrerKlikk(annonse?.annonse_id)}>
      <div className="AnnonseHovedkort">
        {annonse.bilde_url && <img src={annonse.bilde_url} alt="" className="Annonsebilde" />}

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
              {annonse.sokeord.map((ord) => (
                <span key={ord} className="AnnonsekortTag">
                  {ord}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
