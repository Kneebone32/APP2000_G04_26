import { useAutentisering } from "../hooks/useAutentisering";
import { useFetchAnnonser } from "../hooks/useFetchAnnonser";
import AnnonseModerator from "./AnnonseModerator";

//Wrapper som gir annonsør tilgang til kun sine egne annonser. Laget av Kay
export default function AnnonsørAnnonsePanel() {
  const { bruker, token } = useAutentisering({ autoFetch: true });
  const { annonser } = useFetchAnnonser({ autoFetch: true, token });
  const mineAnnonser = annonser.filter((annonse) => annonse.bruker_id === bruker?.bruker_id);

  return <AnnonseModerator annonser={mineAnnonser} />;
}
