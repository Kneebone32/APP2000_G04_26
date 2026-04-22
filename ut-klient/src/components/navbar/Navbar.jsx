/*
Laget av Eivind, Olai & Kay
*/

import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAutentisering } from "../../hooks/useAutentisering";
import Logginn from "../autentisering/Logginn";
import { toast } from "react-toastify";
import RegisterBruker from "../autentisering/RegistrerBruker";
import NavbarRoller from "./NavbarRoller";
import Sokefelt from "../sok/Sokefelt";
import ArtikkelModal from "../artikkel/modal/ArtikkelModal";
import { ARTIKKEL_SLUG } from "../../constants/konstanter";
import { useVarsler } from "../../hooks/useVarsler";
import { useMeldinger } from "../../hooks/useMeldinger";
import "flag-icons/css/flag-icons.min.css";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { bruker, erAutentisert, loggut, logginn, registrer, loading, error, token, mineRoller } = useAutentisering({ autoFetch: true });
  const { varsler } = useVarsler({ token, autoPoll: erAutentisert });
  const { samtaler } = useMeldinger({ token, autoPoll: erAutentisert });
  const [visLogginn, setVisLogginn] = useState(false);
  const [visRegistrer, setVisRegistrer] = useState(false);
  const [visBrukerMeny, setVisBrukerMeny] = useState(false);
  const ulestVarsler = varsler.filter((varsel) => varsel.status === "ulest").length;
  const ulesteMeldinger = samtaler.filter((samtale) => Number(samtale.antall_uleste_meldinger) > 0).length;

  const toggleSpråk = () => {
    const nyttSpråk = i18n.language === "no" ? "en" : "no";
    i18n.changeLanguage(nyttSpråk);
  };

  const navRef = useRef();

  const showNavbar = () => {
    const isOpening = !navRef.current.classList.contains("responsive_nav");
    navRef.current.classList.toggle("responsive_nav");

    if (isOpening) {
      const event = new CustomEvent("navbarOpened");
      document.dispatchEvent(event);
    }
  };

  const closeNavbar = () => {
    navRef.current.classList.remove("responsive_nav");
    setVisBrukerMeny(false);
  };

  const handleLogginnKlikk = () => {
    setVisLogginn(true);
    closeNavbar();
  };

  const byttTilRegistrer = () => {
    setVisLogginn(false);
    setVisRegistrer(true);
  };

  const byttTilLoggInn = () => {
    setVisRegistrer(false);
    setVisLogginn(true);
  };

  const handleLoggUt = () => {
    loggut();
    setVisBrukerMeny(false);
    closeNavbar();
    toast.success(t("nav.logget_ut"));
    navigate("/");
  };

  const toggleBrukerMeny = () => {
    setVisBrukerMeny((forrige) => !forrige);
  };

  const handleProfilKlikk = () => {
    setVisBrukerMeny(false);
    closeNavbar();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target) && !event.target.closest(".nav-btn")) {
        closeNavbar();
      }
    };

    const handleKartFilterOpen = () => {
      closeNavbar();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("kartFilterOpened", handleKartFilterOpen);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("kartFilterOpened", handleKartFilterOpen);
    };
  }, []);

  return (
    <>
      <header>
        <div className="navbar-inner">
          <Link to="/" className="logo">
            UT.ut
          </Link>

          <nav className="navbar" ref={navRef}>
            <Sokefelt onNavigate={closeNavbar} />
            <Link to="/turer" className="Turer" onClick={closeNavbar}>
              {t("nav.turer")}
            </Link>
            <Link to="/hytter" className="Hytter" onClick={closeNavbar}>
              {t("nav.hytter")}
            </Link>
            <Link to="/kart" className="Kart" onClick={closeNavbar}>
              {t("nav.kart")}
            </Link>
            <Link to="/fellesturer" className="Fellesturer" onClick={closeNavbar}>
              {t("nav.fellesturer")}
            </Link>
            <Link to="/annonser" className="Annonser" onClick={closeNavbar}>
              {t("nav.annonser")}
            </Link>

            {/*Bruker på navbar*/}
            {erAutentisert ? (
              <div className="bruker-dropdown">
                <button onClick={toggleBrukerMeny} className="auth-nav-btn bruker-meny-knapp">
                  {bruker?.bruker_navn}{" "}
                  {ulestVarsler + ulesteMeldinger > 0 && <span className="varsler-badge">{ulestVarsler + ulesteMeldinger}</span>}
                </button>

                {/*Brukermeny*/}
                {visBrukerMeny && (
                  <div className="bruker-dropdown-meny">
                    <Link to="/profil" onClick={handleProfilKlikk} className="dropdown-valg">
                      {t("nav.profil")}
                    </Link>
                    <Link to="/meldinger" onClick={handleProfilKlikk} className="dropdown-valg">
                      {t("nav.meldinger")} {ulesteMeldinger > 0 && <span className="varsler-badge">{ulesteMeldinger}</span>}
                    </Link>
                    <Link to="/varsler" onClick={handleProfilKlikk} className="dropdown-valg">
                      {t("nav.varsler")} {ulestVarsler > 0 && <span className="varsler-badge">{ulestVarsler}</span>}
                    </Link>
                    <Link to="/favoritter" onClick={handleProfilKlikk} className="dropdown-valg">
                      {t("nav.favoritter")}
                    </Link>
                    <Link to="/minefellesturer" onClick={handleProfilKlikk} className="dropdown-valg">
                      {t("nav.mine_fellesturer")}
                    </Link>
                    <NavbarRoller mineRoller={mineRoller} onClick={handleProfilKlikk} />
                    <button onClick={handleLoggUt} className="dropdown-valg">
                      {t("nav.logg_ut")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="LogginnKnapp">
                <button onClick={handleLogginnKlikk} className="auth-nav-btn">
                  {t("nav.logg_inn")}
                </button>
              </div>
            )}
            <button onClick={toggleSpråk} className="språk-toggle" title={t("nav.bytt_språk")}>
              <span className={`fi fi-${i18n.language === "en" ? "no" : "gb"}`}></span>
            </button>
            <button className="nav-btn nav-close-btn" onClick={showNavbar} title={t("nav.lukk")} aria-label={t("nav.lukk")}>
              <FaTimes />
            </button>
          </nav>
          <button className="nav-btn" onClick={showNavbar} title={t("nav.vis")} aria-label={t("nav.vis")}>
            <FaBars />
          </button>
        </div>
      </header>

      {/*Modal til innlogging/register*/}
      <Logginn
        show={visLogginn}
        onClose={() => setVisLogginn(false)}
        onByttTilRegistrer={byttTilRegistrer}
        logginn={logginn}
        loading={loading}
        error={error}
        bruker={bruker}
      />
      <RegisterBruker
        show={visRegistrer}
        onClose={() => setVisRegistrer(false)}
        onByttTilLogginn={byttTilLoggInn}
        registrer={registrer}
        loading={loading}
        error={error}
      />
    </>
  );
}
