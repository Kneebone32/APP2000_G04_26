// Skrevet av Kristoffer med mindre annet er spesifisert

import { useMemo, useState, useEffect } from "react";
import { FaMap, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { useFellestur } from "../hooks/useFellesturer";
import { tilfeldigBilde } from "../constants/heroBilder";
import { hentKommendeFellesturer } from "../utils/fellesturUtils.jsx";
import HomeHero from "../components/home/HomeHero";
import PopulaereTurer from "../components/home/PopulaereTurer";
import KommendeFellesturer from "../components/home/KommendeFellesturer";
import "./Home.css";

export default function Home() {
  const { t } = useTranslation();
  const heroBilde = useMemo(() => tilfeldigBilde(), []);

  const { fetchPopulaereTurer, loadingTurer } = useFetchTurer();
  const { fellesturer, loadingFellesturer } = useFellestur({ autoFetch: true });

  const [populæreTurer, setPopulaereTurer] = useState([]);

  useEffect(() => {
    fetchPopulaereTurer(3).then(setPopulaereTurer);
  }, [fetchPopulaereTurer]);

  const kommendeFellesturer = hentKommendeFellesturer(fellesturer);

  return (
    <div className="home">
      <HomeHero bilde={heroBilde} />

      <PopulaereTurer turer={populæreTurer} loading={loadingTurer} />

      {/* Utforsk på kartet */}
      <section className="home-kart-banner">
        <div className="home-kart-innhold">
          <FaMap className="home-kart-ikon" />
          <div className="home-kart-tekst">
            <h2>{t("home.utforsk_kart")}</h2>
            <p>{t("home.kart_beskrivelse")}</p>
          </div>
          <Link to="/kart" className="home-kart-knapp">
            {t("home.åpne_kart")} <FaArrowRight />
          </Link>
        </div>
      </section>

      <KommendeFellesturer fellesturer={kommendeFellesturer} loading={loadingFellesturer} />
    </div>
  );
}
