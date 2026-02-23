/*
Laget av Eivind & Olai
*/

import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import 'flag-icons/css/flag-icons.min.css';
import './Navbar.css'

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const toggleSpråk = () => {
  const nyttSpråk = i18n.language === "no" ? "en" : "no";
    i18n.changeLanguage(nyttSpråk);
  };
  
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  }

  const closeNavbar = () => {
    navRef.current.classList.remove("responsive_nav");
  }

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
    <header>
        <Link to="/" className="logo">UT.ut</Link>
        
        
          <nav className="navbar" ref={navRef}>
            <Link to="/turer" className="Turer" onClick={closeNavbar}>{t("nav.turer")}</Link>
            <Link to="/hytter" className="Hytter" onClick={closeNavbar}>{t("nav.hytter")}</Link>
            <Link to="/kart" className="Kart" onClick={closeNavbar}>{t("nav.kart")}</Link>
            <Link to="/fellesturer" className="Fellesturer" onClick={closeNavbar}>{t("nav.fellesturer")}</Link>
            <Link to="/annonser" className="Annonser" onClick={closeNavbar}>{t("nav.annonser")}</Link>
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
  );
}
