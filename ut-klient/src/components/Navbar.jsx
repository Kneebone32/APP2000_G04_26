import { Link } from "react-router-dom";
import './Navbar.css'
import { useTranslation } from "react-i18next";
import 'flag-icons/css/flag-icons.min.css';

export default function Navbar() {
  const { t, i18n } = useTranslation();

    const toggleSpråk = () => {
    const nyttSpråk = i18n.language === "no" ? "en" : "no";
    i18n.changeLanguage(nyttSpråk);
  };

  return (
    <header className="header">
        <Link to="/" className="logo">UT.ut</Link>
        
        
          <nav className="navbar">
            <Link to="/turer" className="Turer">{t("nav.turer")}</Link>
            <Link to="/hytter" className="Hytter">{t("nav.hytter")}</Link>
            <Link to="/kart" className="Kart">{t("nav.kart")}</Link>
            <Link to="/fellesturer" className="Fellesturer">{t("nav.fellesturer")}</Link>
            <Link to="/annonser" className="Annonser">{t("nav.annonser")}</Link>
            <Link to="/profil" className="Profil">{t("nav.profil")}</Link>

          <button onClick={toggleSpråk} className="språk-toggle" title="Bytt språk">
          <span className={`fi fi-${i18n.language === "en" ? "no" : "gb"}`}></span>
        </button>
          </nav>
        
    </header>
  );
}
