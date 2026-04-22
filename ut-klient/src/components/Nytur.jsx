import KartLagTur from "./kart/KartLagTur";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import "./Nytur.css";

//For å opprette en ny turrute. Laget av Kay
export default function Nytur({
  rutePunkter,
  setRutePunkter,
  onLagreKoordinater,
  hytterITuren,
  setHytterITuren,
  turmålITuren,
  setTurmålITuren,
  stierITuren,
  setStierITuren,
  nyeStier,
  setNyeStier,
}) {
  const { t } = useTranslation();
  const [resetRute, setResetRute] = useState(0);
  const [pendingNyStiPunkter, setPendingNyStiPunkter] = useState([]);

  const handleLagre = () => {
    if (pendingNyStiPunkter.length > 0) {
      setNyeStier((prev) => [...prev, pendingNyStiPunkter]);
      setPendingNyStiPunkter([]);
    }
    onLagreKoordinater?.(rutePunkter);
  };

  return (
    <div>
      {/*Håndterer turlaging*/}
      <div className="rute-kontroller">
        <div className="rute-kontroller-punkter">
          <div className="rute-kontroller-tur">
            <strong>{t("nytur.antall_stier")}</strong> {stierITuren.length}
          </div>
          <div className="rute-kontroller-tur">
            <strong>{t("nytur.antall_hytter")}</strong> {hytterITuren.length}
          </div>
          <div className="rute-kontroller-tur">
            <strong>{t("nytur.antall_turmål")}</strong> {turmålITuren.length}
          </div>
          <div className="rute-kontroller-tur">
            <strong>{t("nytur.antall_nye_stier")}</strong> {nyeStier.length}
          </div>
        </div>
        <div className="rute-kontroller-knapp-container">
          {/*Fjerner alle punkter*/}
          <button
            onClick={() => {
              setRutePunkter([]);
              setHytterITuren([]);
              setTurmålITuren([]);
              setStierITuren([]);
              setNyeStier([]);
              setPendingNyStiPunkter([]);
              setResetRute((k) => k + 1);
            }}
            className="rute-knapp rute-knapp-tøm"
          >
            {t("nytur.tøm_rute")}
          </button>

          {/*Fjerner siste punkt*/}
          {rutePunkter.length > 0 && (
            <button onClick={() => setRutePunkter((prev) => prev.slice(0, -1))} className="rute-knapp rute-knapp-fjern">
              {t("nytur.fjern_siste")}
            </button>
          )}

          {/*Lagrer alle punkter*/}
          {rutePunkter.length > 0 && (
            <button onClick={handleLagre} className="rute-knapp rute-knapp-log">
              {t("nytur.lagre_koordinater")}
            </button>
          )}
        </div>
      </div>

      <KartLagTur
        key={resetRute}
        rutePunkter={rutePunkter}
        setRutePunkter={setRutePunkter}
        center={[59.4087, 9.0593]}
        zoom={12}
        setHytterITuren={setHytterITuren}
        setTurmålITuren={setTurmålITuren}
        setStierITuren={setStierITuren}
        setNyeStier={setNyeStier}
        pendingNyStiPunkter={pendingNyStiPunkter}
        setPendingNyStiPunkter={setPendingNyStiPunkter}
      />
    </div>
  );
}
