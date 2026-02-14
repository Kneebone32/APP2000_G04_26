import KartHentEttPunkt from "./kart/KartHentEttPunkt";
import { useState } from "react";

//Komponent til å lagre koordinater til ett punkt. Hele filen laget av Kay med mindre annet er spesifisert
export default function NyttKoordinat({onLagreKoordinat, ikon}){
  const [koordinat, setKoordinat] = useState(null);

  const handleLagre = () => {
    onLagreKoordinat?.(koordinat);
    console.log("koordinat:", koordinat); //temp løsning
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