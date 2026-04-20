import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import ArtikkelModal from "./artikkel/modal/ArtikkelModal";
import { ARTIKKEL_SLUG } from "../constants/konstanter";
import "./Footer.css";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <section className="footer-column">
          <h3>{t("footer.kontakt_oss")}</h3>
          <ul className="footer-links-list">
            <li>
              <ArtikkelModal
                slug={ARTIKKEL_SLUG.OM_OSS}
                lenkeTekst={t("footer.om_oss")}
                lenkeKlasseNavn="footer-link-button"
              />
            </li>
            <li>
              <ArtikkelModal
                slug={ARTIKKEL_SLUG.KONTAKT}
                lenkeTekst={t("footer.kontakt")}
                lenkeKlasseNavn="footer-link-button"
              />
            </li>
          </ul>
        </section>

        <section className="footer-column">
          <h3>{t("footer.snarveier")}</h3>
          <ul className="footer-links-list">
            <li><Link to="/turer" className="footer-link">{t("nav.turer")}</Link></li>
            <li><Link to="/hytter" className="footer-link">{t("nav.hytter")}</Link></li>
            <li><Link to="/fellesturer" className="footer-link">{t("nav.fellesturer")}</Link></li>
            <li><Link to="/kart" className="footer-link">{t("nav.kart")}</Link></li>
            <li><Link to="/annonser" className="footer-link">{t("nav.annonser")}</Link></li>
          </ul>
        </section>

        <section className="footer-column">
          <h3>{t("footer.følg_oss")}</h3>
          <div className="footer-socials">
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;