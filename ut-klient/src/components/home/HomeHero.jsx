// Skrevet av Kristoffer med mindre annet er spesifisert

import { FaCamera } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Sokefelt from "../navbar/Sokefelt";

export default function HomeHero({ bilde }) {
  const { t } = useTranslation();

  return (
    <section className="home-hero" style={{ backgroundImage: `url(${bilde.src})` }}>
      <div className="home-hero-overlay" />
      <div className="home-hero-innhold">
        <h1 className="home-hero-tittel">{t("home.hero_tittel")}</h1>
        <p className="home-hero-undertittel">{t("home.hero_undertittel")}</p>
        <div className="home-hero-sok">
          <Sokefelt />
        </div>
      </div>
      <p className="home-hero-kreditering">
        <FaCamera aria-hidden="true" /> {bilde.kreditering}
      </p>
    </section>
  );
}
