import { useParams } from "react-router-dom";
import TurNavigasjon from "../components/navigasjon/NavigasjonTurrute";
import Kart_basic from "../components/kart/KartBasic";

export default function Navigasjon() {
  const { turId } = useParams();

  return (
    <Kart_basic>
        {turId && <TurNavigasjon turId={turId} />}
    </Kart_basic>
  );
}