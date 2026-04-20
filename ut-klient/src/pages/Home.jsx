import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMap, FaArrowRight, FaCamera } from "react-icons/fa";
import norddalsfjorden from "../assets/norddalsfjorden.jpg";
import graddiselva from "../assets/graddiselva.jpg";
import lyngenfjorden from "../assets/lyngenfjorden.jpg";
import Sokefelt from "../components/navbar/Sokefelt";
import TurKort from "../components/turruter/TurKort";
import FellesturKort from "../components/fellesturer/FellesturKort";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { useFellestur } from "../hooks/useFellesturer";
import { DATO_STATUS } from "../constants/konstanter";
import "./Home.css";

// Legg til flere bilder her — hvert objekt har bildefil og kreditering
const HERO_BILDER = [
  {
    src: norddalsfjorden,
    kreditering: "By Ximonic (Simo Räsänen) - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=48042325",
  },

  {
    src: graddiselva,
    kreditering: "By Ximonic (Simo Räsänen) - Own work, CC BY-SA 4.0, https://commons.wikimedia.org/w/index.php?curid=114190112",
  },

  {
    src: lyngenfjorden,
    kreditering: "By Ximonic, Simo Räsänen - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=15528145",
  },
];

function tilfeldigBilde() {
  return HERO_BILDER[Math.floor(Math.random() * HERO_BILDER.length)];
}

export default function Home() {
  const heroBilde = useMemo(() => tilfeldigBilde(), []);

  const { fetchPopulaereTurer, loadingTurer } = useFetchTurer();
  const { fellesturer, loadingFellesturer } = useFellestur({ autoFetch: true });

  const [populæreTurer, setPopulaereTurer] = useState([]);

  useEffect(() => {
    fetchPopulaereTurer(3).then(setPopulaereTurer);
  }, [fetchPopulaereTurer]);

  const kommendeFellesturer = fellesturer
    .filter((f) => {
      const aktive = (f.datoer ?? []).filter((d) => d.aktivitet_dato_status !== DATO_STATUS.AVLYST);
      const valgt = aktive.find((d) => d.aktivitet_dato_status === DATO_STATUS.VALGT);
      const bruk = valgt ?? aktive[0];
      if (!bruk) return false;
      return new Date(bruk.aktivitet_start_dato) >= new Date();
    })
    .sort((a, b) => {
      const hentDato = (f) => {
        const aktive = (f.datoer ?? []).filter((d) => d.aktivitet_dato_status !== DATO_STATUS.AVLYST);
        const bruk = aktive.find((d) => d.aktivitet_dato_status === DATO_STATUS.VALGT) ?? aktive[0];
        return new Date(bruk.aktivitet_start_dato);
      };
      return hentDato(a) - hentDato(b);
    })
    .slice(0, 3);

  return (
    <div className="home">
      {/* Hero-seksjon */}
      <section className="home-hero" style={{ backgroundImage: `url(${heroBilde.src})` }}>
        <div className="home-hero-overlay" />
        <div className="home-hero-innhold">
          <h1 className="home-hero-tittel">Finn din neste tur</h1>
          <p className="home-hero-undertittel">Søk blant turer, hytter og turmål i hele Utopia</p>
          <div className="home-hero-sok">
            <Sokefelt />
          </div>
        </div>
        <p className="home-hero-kreditering">
          <FaCamera aria-hidden="true" /> {heroBilde.kreditering}
        </p>
      </section>

      {/* Populære turer */}
      <section className="home-seksjon">
        <div className="home-seksjon-header">
          <h2 className="home-seksjon-tittel">Populære turer</h2>
          <Link to="/turer" className="home-se-alle">
            Se alle <FaArrowRight />
          </Link>
        </div>
        {loadingTurer ? (
          <p className="home-laster">Laster turer...</p>
        ) : populæreTurer.length === 0 ? (
          <p className="home-ingen">Ingen turer funnet</p>
        ) : (
          <div className="home-kort-grid">
            {populæreTurer.map((tur) => (
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

      {/* Utforsk på kartet */}
      <section className="home-kart-banner">
        <div className="home-kart-innhold">
          <FaMap className="home-kart-ikon" />
          <div className="home-kart-tekst">
            <h2>Utforsk på kartet</h2>
            <p>Se turer, hytter og turmål på interaktivt kart</p>
          </div>
          <Link to="/kart" className="home-kart-knapp">
            Åpne kart <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Kommende fellesturer */}
      <section className="home-seksjon">
        <div className="home-seksjon-header">
          <h2 className="home-seksjon-tittel">Kommende fellesturer</h2>
          <Link to="/fellesturer" className="home-se-alle">
            Se alle <FaArrowRight />
          </Link>
        </div>
        {loadingFellesturer ? (
          <p className="home-laster">Laster fellesturer...</p>
        ) : kommendeFellesturer.length === 0 ? (
          <p className="home-ingen">Ingen kommende fellesturer</p>
        ) : (
          <div className="home-kort-grid">
            {kommendeFellesturer.map((f) => (
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
    </div>
  );
}
