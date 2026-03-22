import LeggTilAnnonse from "../components/annonse/LeggTilAnnonse";
import AnnonseKort from "../components/annonse/AnnonseKort";
import { useFetchAnnonser } from "../hooks/useFetchAnnonser";
import "./AnnonseModerator.css";

// Administrasjonsside for annonser. 
export default function AnnonseModerator() {
  const { annonser, loadingAnnonser, errorAnnonser, refetch } = useFetchAnnonser({ autoFetch: true });

  return (
    <div className="AnnonseModeratorPanel">
      <h1>Annonser</h1>

      <LeggTilAnnonse onSuccess={refetch} />

      <hr />

    </div>
  );
}