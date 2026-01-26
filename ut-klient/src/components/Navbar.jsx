import { Link } from "react-router-dom";
import './Navbar.css'

export default function Navbar() {
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
          </nav>
        
    </header>
  );
}
