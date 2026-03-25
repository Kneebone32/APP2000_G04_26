import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/navbar/Navbar";
import AnnouncementBar from "./components/AnnouncementBar";
//import "./components/AnnouncementBar.css";

import Home from "./pages/Home";
import Turer from "./pages/Turer";
import TurDetaljer from "./pages/TurDetaljer";
import Hytter from "./pages/Hytter";
import HytteDetaljer from "./pages/HytteDetaljer";
import Kart from "./pages/Kart";
import Fellesturer from "./pages/fellesturer/Fellesturer";
import FellesturerDetaljer from "./pages/fellesturer/FellesturerDetaljer";
import Annonser from "./pages/Annonser";
import Profil from "./pages/Profil";
import Admin from "./pages/Admin";
import HytteModerator from "./pages/HytteModerator";
import TurModerator from "./pages/TurModerator";
import AnnonseModerator from "./pages/AnnonseModerator";
import FellesturModerator from "./pages/fellesturer/FellesturModerator";
import TurmålModerator from "./pages/turmål/TurmålModerator";
import Feilside from "./pages/Feilside";
import Favoritter from "./pages/favoritter/Favoritter";
import Meldinger from "./pages/Meldinger";
import Varsler from "./pages/Varsler";
import ProtectedRoute from "./components/ProtectedRoute";
import Test from "./pages/Test";
import Test2 from "./pages/Test2";
import Navigasjon from "./pages/Navigasjon";

// Hovedkomponent som setter opp routing for hele applikasjonen. Laget av Olai og Kay.
export default function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <AnnouncementBar />
        <ToastContainer position="top-center" autoClose={5000} />

        <main className="MainContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/turer" element={<Turer />} />
            <Route path="/turer/:turId" element={<TurDetaljer />} />
            <Route path="/hytter" element={<Hytter />} />
            <Route path="/hytter/:hytteId" element={<HytteDetaljer />} />
            <Route path="/kart" element={<Kart />} />
            <Route path="/fellesturer" element={<Fellesturer />} />
            <Route path="/fellesturer/:fellesturId" element={<FellesturerDetaljer />} />
            <Route path="/annonser" element={<Annonser />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/profil" element={<Profil />} />
              <Route path="/meldinger" element={<Meldinger />} />
              <Route path="/varsler" element={<Varsler />} />
              <Route path="/favoritter" element={<Favoritter />} />
            </Route>

            <Route element={<ProtectedRoute rolle="admin" />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/hytter" element={<HytteModerator />} />
              <Route path="/admin/turer" element={<TurModerator />} />
              <Route path="/admin/annonser" element={<AnnonseModerator />} />
              <Route path="/admin/fellesturer" element={<FellesturModerator />} />
              <Route path="/admin/turmål" element={<TurmålModerator />} />
            </Route>

            <Route path="/test" element={<Test />} />
            <Route path="/test2" element={<Test2 />} />
            <Route path="/navigasjon/:turId" element={<Navigasjon />} />
            <Route path="*" element={<Feilside />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}