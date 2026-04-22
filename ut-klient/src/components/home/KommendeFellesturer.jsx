// Skrevet av Kristoffer med mindre annet er spesifisert

import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import FellesturKort from "../fellesturer/FellesturKort";

export default function KommendeFellesturer({ fellesturer, loading }) {
  const { t } = useTranslation();

  return (
    <section className="home-seksjon">
      <div className="home-seksjon-header">
        <h2 className="home-seksjon-tittel">{t("home.kommende_fellesturer")}</h2>
        <Link to="/fellesturer" className="home-se-alle">
          {t("home.se_alle")} <FaArrowRight />
        </Link>
      </div>
      {loading ? (
        <p className="home-laster">{t("home.laster_fellesturer")}</p>
      ) : fellesturer.length === 0 ? (
        <p className="home-ingen">{t("home.ingen_fellesturer")}</p>
      ) : (
        <div className="home-kort-grid">
          {fellesturer.map((f) => (
            <FellesturKort
              key={f.aktivitet_id}
              fellesturId={f.aktivitet_id}
              fellesturNavn={f.aktivitet_tittel}
              dato={f.datoer}
              bildeUrl={f.bilder?.[0]?.aktivitet_url}
            />
          ))}
        </div>
      )}
    </section>
  );
}
