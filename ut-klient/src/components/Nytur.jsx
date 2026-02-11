import KartLagTur from "./kart/KartLagTur";
import "./Nytur.css";

//For å opprette en ny turrute. Laget av Kay
export default function Nytur({rutePunkter, setRutePunkter, onLagreKoordinater}) {

  const handleLagre = () => {
    onLagreKoordinater?.(rutePunkter);
  };

  return (
    <div>
      {/*Håndterer turlaging*/}
      <div className="rute-kontroller">
        <div className="rute-kontroller-punkter">
          <strong>Antall punkter:</strong> {rutePunkter.length}
        </div>
        <div className="rute-kontroller-knapp-container">

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

        {/*Lagrer alle punkter*/}
        {rutePunkter.length > 0 && (
          <button 
            onClick={handleLagre}
            className="rute-knapp rute-knapp-log"
          >
            Lagre koordinater
          </button>
        )}
        </div>
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


