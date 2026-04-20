import KartHentEttPunkt from "./kart/KartHentEttPunkt";
import { useState } from "react";
import { useTranslation } from "react-i18next";

//Komponent til å lagre koordinater til ett punkt. Laget av Kay
export default function NyttKoordinat({ onLagreKoordinat, ikon }) {
  const { t } = useTranslation();
  const [koordinat, setKoordinat] = useState(null);

  const handleLagre = () => {
    onLagreKoordinat?.(koordinat);
  };

  return (
    <div>
      <div className="punkt-kontroller">
        <button type="button" onClick={handleLagre}>
          {t("nytt_koordinat.lagre")}
        </button>
        <button type="button" onClick={() => setKoordinat(null)}>
          {t("nytt_koordinat.fjern")}
        </button>
      </div>

      <KartHentEttPunkt punkt={koordinat} setPunkt={setKoordinat} markerIcon={ikon} />
    </div>
  );
}
