import { useState } from "react";
import LeggTilAnnonse from "../components/annonse/LeggTilAnnonse";
import RedigerAnnonse from "../components/annonse/RedigerAnnonse";
import SlettAnnonse from "../components/annonse/SlettAnnonse";
import AnnonseStatistikk from "../components/annonse/AnnonseStatistikk";
import { useFetchAnnonser } from "../hooks/useFetchAnnonser";
import { ANNONSE_FANER } from "../constants/konstanter";
import "./AnnonseModerator.css";

// Administrasjonsside for annonser. Laget av Olai.
export default function AnnonseModerator() {
  const [aktivFane, setAktivFane] = useState("Legg til");
  const { refetch } = useFetchAnnonser({ autoFetch: false });

  return (
    <div className="AnnonseModeratorPanel">
      <h1>Annonser</h1>

      <div className="AnnonseFaneContainer">
        {ANNONSE_FANER.map(fane => (
          <button
            key={fane}
            className={`btn ${aktivFane === fane ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setAktivFane(fane)}
          >
            {fane}
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

      {aktivFane === "Statistikk" && (
        <AnnonseStatistikk />
      )}
    </div>
  );
}
