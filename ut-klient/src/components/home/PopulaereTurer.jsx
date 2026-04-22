// Skrevet av Kristoffer med mindre annet er spesifisert

import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import TurKort from "../turruter/TurKort";

export default function PopulaereTurer({ turer, loading }) {
  const { t } = useTranslation();

  return (
    <section className="home-seksjon">
      <div className="home-seksjon-header">
        <h2 className="home-seksjon-tittel">{t("home.populære_turer")}</h2>
        <Link to="/turer" className="home-se-alle">
          {t("home.se_alle")} <FaArrowRight />
        </Link>
      </div>
      {loading ? (
        <p className="home-laster">{t("home.laster_turer")}</p>
      ) : turer.length === 0 ? (
        <p className="home-ingen">{t("home.ingen_turer")}</p>
      ) : (
        <div className="home-kort-grid">
          {turer.map((tur) => (
            <TurKort
              key={tur.tur_id}
              turId={tur.tur_id}
              turNavn={tur.tur_navn}
              vanskelighetsgrad={tur.vanskelighetsgrad}
              bildeUrl={tur.bilder?.[0]?.tur_url}
              turtype={tur.turtype}
              varighet={tur.varighet}
              lat={tur.punkter?.[0]?.[0]}
              lon={tur.punkter?.[0]?.[1]}
              snittrating={tur.snittrating}
              antallAnmeldelser={tur.antall_anmeldelser}
            />
          ))}
        </div>
      )}
    </section>
  );
}
