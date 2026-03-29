import { useState } from "react";
import LeggTilAnnonse from "../components/annonse/LeggTilAnnonse";
import RedigerAnnonse from "../components/annonse/RedigerAnnonse";
import SlettAnnonse from "../components/annonse/SlettAnnonse";
import AnnonseStatistikk from "../components/annonse/AnnonseStatistikk";
import AnnonseKort from "../components/annonse/AnnonseKort";
import { useFetchAnnonser } from "../hooks/useFetchAnnonser";
import "./AnnonseModerator.css";

const FANER = ["Legg til", "Rediger", "Slett", "Godkjenn", "Statistikk"];

// Administrasjonsside for annonser. Laget av Olai.
export default function AnnonseModerator() {
  const [aktivFane, setAktivFane] = useState("Legg til");
  const { annonser, loadingAnnonser, errorAnnonser, refetch, godkjennAnnonse, avvisAnnonse } = useFetchAnnonser({ autoFetch: true });

  // Filtrerer ut annonser som venter på godkjenning.
  const ventende = annonser.filter(a => a.status === "venter");

  // Godkjenner en annonse og oppdaterer listen.
  const handleGodkjenn = async (id) => {
    try {
      await godkjennAnnonse(id);
    } catch (err) {
      console.error("Error: ", err);
      alert("Kunne ikke godkjenne annonsen");
    }
  };

  // Avviser en annonse etter bekreftelse og oppdaterer listen.
  const handleAvvis = async (id) => {
    if (window.confirm("Er du sikker på at du vil avvise denne annonsen?")) {
      try {
        await avvisAnnonse(id);
      } catch (err) {
        console.error("Error: ", err);
        alert("Kunne ikke avvise annonsen");
      }
    }
  };

  return (
    <div className="AnnonseModeratorPanel">
      <h1>Annonser</h1>

      <div className="AnnonseFaneContainer">
        {FANER.map(fane => (
          <button
            key={fane}
            className={`btn ${aktivFane === fane ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setAktivFane(fane)}
          >
            {fane}
            {fane === "Godkjenn" && ventende.length > 0 && (
              <span className="AnnonseVentendeBadge">
                {ventende.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {aktivFane === "Legg til" && (
        <LeggTilAnnonse onSuccess={refetch} />
      )}

      {aktivFane === "Rediger" && (
        <RedigerAnnonse onSuccess={refetch} />
      )}

      {aktivFane === "Slett" && (
        <SlettAnnonse onSuccess={refetch} />
      )}

      {aktivFane === "Godkjenn" && (
        <div>
          <h2>Godkjenn annonser</h2>
          {loadingAnnonser && <p>Laster annonser...</p>}
          {errorAnnonser && <p style={{ color: 'red' }}>{errorAnnonser}</p>}
          {!loadingAnnonser && ventende.length === 0 && (
            <p>Ingen annonser venter på godkjenning.</p>
          )}
          {ventende.map(annonse => (
            <div key={annonse.annonse_id} className="AnnonseGodkjennRad">
              <div className="AnnonseGodkjennKort">
                <AnnonseKort annonse={annonse} />
              </div>
              <div className="AnnonseGodkjennKnapper">
                <button className="btn btn-success" onClick={() => handleGodkjenn(annonse.annonse_id)}>
                  Godkjenn
                </button>
                <button className="btn btn-danger" onClick={() => handleAvvis(annonse.annonse_id)}>
                  Avvis
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {aktivFane === "Statistikk" && (
        <AnnonseStatistikk />
      )}
    </div>
  );
}
