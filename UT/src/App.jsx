import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Turer from "./pages/Turer";
import Hytter from "./pages/Hytter";
import Kart from "./pages/Kart";
import Fellesturer from "./pages/Fellesturer";
import Annonser from "./pages/Annonser";
import Profil from "./pages/Profil";

export default function App() {
  return (
    <Router>
      <div className="min-vh-100">
        <Navbar />

        <main className="container-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/turer" element={<Turer />} />
            <Route path="/hytter" element={<Hytter />} />
            <Route path="/kart" element={<Kart />} />
            <Route path="/fellesturer" element={<Fellesturer />} />
            <Route path="/annonser" element={<Annonser />} />
            <Route path="/profil" element={<Profil />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}