import KartLeggTilHytterTurmål from "../../kart/KartLeggTilHytterTurmål";
import { useTranslation } from "react-i18next";

//Velger hytter og turmål for en fellestur ved GPX opplastning. Laget av Kay
export default function LeggTilHytterTurmål({ gpxKoords, hytterITuren, setHytterITuren, turmålITuren, setTurmålITuren, onLagre }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="rute-kontroller">
        <div className="rute-kontroller-punkter">
          <div className="rute-kontroller-tur">
            <strong>{t("fellestur_form.antall_hytter")}</strong> {hytterITuren.length}
          </div>
          <div className="rute-kontroller-tur">
            <strong>{t("fellestur_form.antall_turmål")}</strong> {turmålITuren.length}
          </div>
        </div>
        <div className="rute-kontroller-knapp-container">
          <button
            onClick={() => {
              setHytterITuren([]);
              setTurmålITuren([]);
            }}
            className="rute-knapp rute-knapp-tøm"
          >
            {t("fellestur_form.tøm_valg")}
          </button>
          {(hytterITuren.length > 0 || turmålITuren.length > 0) && (
            <button onClick={onLagre} className="rute-knapp rute-knapp-log">
              {t("fellestur_form.lagre_valg")}
            </button>
          )}
        </div>
      </div>

      <KartLeggTilHytterTurmål
        gpxKoords={gpxKoords}
        hytterITuren={hytterITuren}
        setHytterITuren={setHytterITuren}
        turmålITuren={turmålITuren}
        setTurmålITuren={setTurmålITuren}
      />
    </div>
  );
}
