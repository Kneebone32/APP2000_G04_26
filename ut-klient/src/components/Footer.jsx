import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import ArtikkelModal from "./artikkel/modal/ArtikkelModal";
import { ARTIKKEL_SLUG } from "../constants/konstanter";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <section className="footer-column">
          <h3>Kontakt oss</h3>
          <ul className="footer-links-list">
            <li>
              <ArtikkelModal
                slug={ARTIKKEL_SLUG.OM_OSS}
                lenkeTekst="Om oss"
                lenkeKlasseNavn="footer-link-button"
              />
            </li>
            <li>
              <ArtikkelModal
                slug={ARTIKKEL_SLUG.KONTAKT}
                lenkeTekst="Kontakt"
                lenkeKlasseNavn="footer-link-button"
              />
            </li>
          </ul>
        </section>

        <section className="footer-column">
          <h3>Snarveier</h3>
          <ul className="footer-links-list">
            <li><Link to="/turer" className="footer-link">Turer</Link></li>
            <li><Link to="/hytter" className="footer-link">Hytter</Link></li>
            <li><Link to="/fellesturer" className="footer-link">Fellesturer</Link></li>
            <li><Link to="/kart" className="footer-link">Kart</Link></li>
            <li><Link to="/annonser" className="footer-link">Annonser</Link></li>
          </ul>
        </section>

        <section className="footer-column">
          <h3>Følg oss</h3>
          <div className="footer-socials">
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;