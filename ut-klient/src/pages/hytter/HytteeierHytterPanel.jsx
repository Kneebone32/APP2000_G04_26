import HytteModerator from "./HytteModerator";
import { useFetchHytter } from "../../hooks/useFetchHytter";
import { useAutentisering } from "../../hooks/useAutentisering";

// Wrapper som gir hytteeier tilgang til kun sine egne hytter. Laget av Kay
export default function HytteeierHytterPanel() {
    const { token } = useAutentisering({ autoFetch: true });
    const { hytter, mineHytteIder } = useFetchHytter({ autoFetch: true, token });
    const mineHytter = hytter.filter(hytte => mineHytteIder.includes(hytte.hytte_id));

    return <HytteModerator hytter={mineHytter} />;
}