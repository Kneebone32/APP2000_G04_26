import KartHentEttPunkt from "./kart/KartHentEttPunkt";
import { useState } from "react";


export default function NyttKoordinat({onLagreKoordinat}){
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
      />
    </div>
  );
}