import { useAutentisering } from "../../hooks/useAutentisering";
import { useMineFellesturer } from "../../hooks/useMineFellesturer";
import FellesturModerator from "./FellesturModerator";

//Wrapper som gir turleder tilgang til kun side egne Fellesturer. Laget av Kay
export default function TurlederFellesturPanel() {
    const { token } = useAutentisering({autoFetch: true});
    const { mineFellesturerTurleder } = useMineFellesturer({token});

    return <FellesturModerator fellesturer={mineFellesturerTurleder} />;
}
