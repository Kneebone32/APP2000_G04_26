import { useState } from "react";
import KartLagTur from "./kart/KartLagTur";
import "./Nytur.css";

export default function Nytur() {
  const [rutePunkter, setRutePunkter] = useState([]);

  return (
    <div>
      {/*Håndterer turlaging*/}
      <div className="rute-kontroller">
        <h3>Lag turrute</h3>
        <p className="rute-kontroller-info">
          Klikk på kartet for å legge til punkter på ruten
        </p>
        
        <div className="rute-kontroller-punkter">
          <strong>Antall punkter:</strong> {rutePunkter.length}
        </div>
        
        {/*Fjerner alle punkter*/}
        <button onClick={() => setRutePunkter([])} className="rute-knapp rute-knapp-tøm">
          Tøm rute
        </button>

        {/*Fjerner siste punkt*/}
        {rutePunkter.length > 0 && (
          <button 
            onClick={() => setRutePunkter(prev => prev.slice(0, -1))}
            className="rute-knapp rute-knapp-fjern"
          >
            Fjern siste punkt
          </button>
        )}

        {/*Logger alle punkter til konsollen. Senere blir disse brukt for å legge til ny tur*/}
        {rutePunkter.length > 0 && (
          <button 
            onClick={() => {
              console.log("Rute-koordinater:");
              console.log(JSON.stringify(rutePunkter, null, 2));
            }}
            className="rute-knapp rute-knapp-log"
          >
            Logg koordinater
          </button>
        )}
      </div>
      
      <KartLagTur 
        rutePunkter={rutePunkter}
        setRutePunkter={setRutePunkter}
        center={[59.4087, 9.0593]}
        zoom={12}
      />
    </div>
  );
}


