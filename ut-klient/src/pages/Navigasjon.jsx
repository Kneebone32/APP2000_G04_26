import { useParams } from "react-router-dom";
import TurNavigasjon from "../components/navigasjon/NavigasjonTurrute";
import Kart_basic from "../components/kart/KartBasic";

export default function Navigasjon() {
  const { turId, fellesturId } = useParams();

  return (
    <Kart_basic>
        {(turId || fellesturId) && (
            <TurNavigasjon turId={turId} fellesturId={fellesturId} />
        )}
    </Kart_basic>
  );
}
