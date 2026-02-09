import { Link } from "react-router-dom";
import './Navbar.css'
import { useTranslation } from "react-i18next";
import 'flag-icons/css/flag-icons.min.css';

export default function Navbar() {
  const {i18n} = useTranslation();

    const toggleSpråk = () => {
    const nyttSpråk = i18n.language === "no" ? "en" : "no";
    i18n.changeLanguage(nyttSpråk);
  };

  return (
    <header className="header">
        <Link to="/" className="logo">UT.ut</Link>
        
        
          <nav className="navbar">
            <Link to="/turer" className="Turer">Turer</Link>
            <Link to="/hytter" className="Hytter">Hytter</Link>
            <Link to="/kart" className="Kart">Kart</Link>
            <Link to="/fellesturer" className="Fellesturer">Fellesturer</Link>
            <Link to="/annonser" className="Annonser">Annonser</Link>
            <Link to="/profil" className="Profil">Profil</Link>

          <button onClick={toggleSpråk} className="språk-toggle" title="Bytt språk">
          <span className={`fi fi-${i18n.language === "en" ? "no" : "gb"}`}></span>
        </button>
          </nav>
        
    </header>
  );
}
