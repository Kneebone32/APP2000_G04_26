import KartLagTur from "./kart/KartLagTur";
import { useTranslation } from "react-i18next";
import "./Nytur.css";

//For å opprette en ny turrute. Laget av Kay
export default function Nytur({rutePunkter, setRutePunkter, onLagreKoordinater, hytterITuren, setHytterITuren}) {
  const { t } = useTranslation();

  const handleLagre = () => {
    onLagreKoordinater?.(rutePunkter);
  };

  return (
    <div>
      {/*Håndterer turlaging*/}
      <div className="rute-kontroller">
        <div className="rute-kontroller-punkter">
          <strong>{t("nytur.antall_punkter")}</strong> {rutePunkter.length}
          <strong> Antall hytter: </strong> {hytterITuren.length}

        </div>
        <div className="rute-kontroller-knapp-container">

        {/*Fjerner alle punkter*/}
        <button onClick={() => {
          setRutePunkter([]);
          setHytterITuren([]);
        }} className="rute-knapp rute-knapp-tøm">
          {t("nytur.tøm_rute")}
        </button>

        {/*Fjerner siste punkt*/}
        {rutePunkter.length > 0 && (
          <button 
            onClick={() => setRutePunkter(prev => prev.slice(0, -1))}
            className="rute-knapp rute-knapp-fjern"
          >
            {t("nytur.fjern_siste")}
          </button>
        )}

        {/*Lagrer alle punkter*/}
        {rutePunkter.length > 0 && (
          <button 
            onClick={handleLagre}
            className="rute-knapp rute-knapp-log"
          >
            {t("nytur.lagre_koordinater")}
          </button>
        )}
        </div>
      </div>
      
      <KartLagTur 
        rutePunkter={rutePunkter}
        setRutePunkter={setRutePunkter}
        center={[59.4087, 9.0593]}
        zoom={12}
        hytterITuren={hytterITuren}
        setHytterITuren={setHytterITuren}
      />
    </div>
  );
}


