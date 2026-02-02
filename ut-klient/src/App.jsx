import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AnnouncementBar from "./components/AnnouncementBar";
import "./components/AnnouncementBar.css";

import Home from "./pages/Home";
import Turer from "./pages/Turer";
import Hytter from "./pages/Hytter";
import HytteDetaljer from "./pages/HytteDetaljer";
import Kart from "./pages/Kart";
import Fellesturer from "./pages/Fellesturer";
import Annonser from "./pages/Annonser";
import Profil from "./pages/Profil";
import Admin from "./pages/Admin";
import Feilside from "./pages/Feilside";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <AnnouncementBar />

        <main className="MainContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/turer" element={<Turer />} />
            <Route path="/hytter" element={<Hytter />} />
            <Route path="/hytter/:hytteId" element={<HytteDetaljer />} />
            <Route path="/kart" element={<Kart />} />
            <Route path="/fellesturer" element={<Fellesturer />} />
            <Route path="/annonser" element={<Annonser />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Feilside />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}