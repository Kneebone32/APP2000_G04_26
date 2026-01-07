import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold">UT.ut</Link>
        
        
          <div className="navbar-nav ms-auto">
            <Link to="/turer" className="nav-link text-white">Turer</Link>
            <Link to="/hytter" className="nav-link text-white">Hytter</Link>
            <Link to="/kart" className="nav-link text-white">Kart</Link>
            <Link to="/fellesturer" className="nav-link text-white">Fellesturer</Link>
            <Link to="/annonser" className="nav-link text-white">Annonser</Link>
            <Link to="/profil" className="nav-link text-white">Profil</Link>
          </div>
        
      </div>
    </nav>
  );
}
