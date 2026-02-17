import KartHentEttPunkt from "./kart/KartHentEttPunkt";
import { useState } from "react";

//Komponent til å lagre koordinater til ett punkt. Laget av Kay
export default function NyttKoordinat({onLagreKoordinat, ikon}){
  const [koordinat, setKoordinat] = useState(null);

  const handleLagre = () => {
    onLagreKoordinat?.(koordinat);
  };

  return (
    <div>
      <div className="punkt-kontroller">
            <button onClick={handleLagre}>Lagre koordinat</button>
            <button onClick={() => setKoordinat(null)}>Fjern</button>
      </div>
      
      <KartHentEttPunkt 
        punkt={koordinat}
        setPunkt={setKoordinat}
        markerIcon={ikon}

      />
    </div>
  );
}