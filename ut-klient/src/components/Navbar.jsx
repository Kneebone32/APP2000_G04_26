/*
Laget av Eivind, Olai & Kay
*/

import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAutentisering } from "../hooks/useAutentisering";
import Logginn from "./autentisering/Logginn";
import { toast } from "react-toastify";
import RegisterBruker from "./autentisering/RegistrerBruker";
import 'flag-icons/css/flag-icons.min.css';
import './Navbar.css'

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const {bruker, erAutentisert, loggut, logginn, registrer, loading, error} = useAutentisering({autoFetch: true})
  const [visLogginn, setVisLogginn] = useState(false);
  const [visRegistrer, setVisRegistrer] = useState(false);

  const toggleSpråk = () => {
  const nyttSpråk = i18n.language === "no" ? "en" : "no";
    i18n.changeLanguage(nyttSpråk);
  };
  
  const navRef = useRef();
  

  const showNavbar = () => {
    const isOpening = !navRef.current.classList.contains("responsive_nav");
    navRef.current.classList.toggle("responsive_nav");
    
    if (isOpening) {
      const event = new CustomEvent('navbarOpened');
      document.dispatchEvent(event);
    }
  }

  const closeNavbar = () => {
    navRef.current.classList.remove("responsive_nav");
  }

  const handleLogginnKlikk = () => {
    setVisLogginn(true);
    closeNavbar();
  };

  const handleRegistrerKlikk = () => {
    setVisRegistrer(true);
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
    closeNavbar();
    toast.success("Du har blitt logget ut")
    
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target) && 
          !event.target.closest('.nav-btn')) {
        closeNavbar();
      }
    };

    const handleKartFilterOpen = () => {
      closeNavbar();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('kartFilterOpened', handleKartFilterOpen);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('kartFilterOpened', handleKartFilterOpen);
    };
  }, []);

  return (
    <>
    <header>
        <Link to="/" className="logo">UT.ut</Link>
        
        
          <nav className="navbar" ref={navRef}>
            <Link to="/turer" className="Turer" onClick={closeNavbar}>{t("nav.turer")}</Link>
            <Link to="/hytter" className="Hytter" onClick={closeNavbar}>{t("nav.hytter")}</Link>
            <Link to="/kart" className="Kart" onClick={closeNavbar}>{t("nav.kart")}</Link>
            <Link to="/fellesturer" className="Fellesturer" onClick={closeNavbar}>{t("nav.fellesturer")}</Link>
            <Link to="/annonser" className="Annonser" onClick={closeNavbar}>{t("nav.annonser")}</Link>

          {/*Bruker på navbar*/}
          {erAutentisert ? (
            <>
              <Link to="/profil" onClick={closeNavbar}>
                {bruker?.bruker_navn}
              </Link>
              <button onClick={handleLoggUt} className="auth-nav-btn">
                Logg ut
              </button>
            </>
          ) : (
              <button onClick={handleLogginnKlikk} className="auth-nav-btn">
                Logg inn
              </button>
          )}

            <Link to="/profil" className="Profil" onClick={closeNavbar}>{t("nav.profil")}</Link>
            <button onClick={toggleSpråk} className="språk-toggle" title="Bytt språk">
                <span className={`fi fi-${i18n.language === "en" ? "no" : "gb"}`}></span>
            </button>
            <button className="nav-btn nav-close-btn" onClick={showNavbar}>
              <FaTimes/>
            </button>



          </nav>
          <button className="nav-btn" onClick={showNavbar}>
            <FaBars/>
          </button>
    </header>
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
