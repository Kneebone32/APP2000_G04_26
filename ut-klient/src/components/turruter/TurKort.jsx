import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hentKommuneData } from "../../utils/geoUtils";
import { useAutentisering } from "../../hooks/useAutentisering";
import { FaClock, FaHiking, FaBicycle, FaSkiing, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import Logginn from "../autentisering/Logginn";
import { handleFavoritt } from "../Favoritt";
import "./TurKort.css";

// Viser et klikkbart turkort med bilde, sted, vanskelighetsgrad og varighet. Laget av Olai og Eivind.
export default function TurKort({
  turId,
  turNavn,
  vanskelighetsgrad,
  bildeUrl,
  turtype,
  varighet,
  lat,
  lon,
  erFavoritt,
  onToggleFavoritt,
  snittrating,
  antallAnmeldelser,
}) {
  const { t } = useTranslation();
  const { logginn, loading, error } = useAutentisering({ autoFetch: false });
  const [kommunenavn, setKommunenavn] = useState("");
  const [fylkesnavn, setFylkesnavn] = useState("");
  const [visLogginn, setVisLogginn] = useState(false);

  const getTurtypeIcon = () => {
    switch (turtype?.toLowerCase()) {
      case "fottur":
        return <FaHiking className="turtype-icon" />;
      case "sykkeltur":
        return <FaBicycle className="turtype-icon" />;
      case "skitur":
        return <FaSkiing className="turtype-icon" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!lat || !lon) return;
    hentKommuneData(lat, lon)
      .then((data) => {
        if (data) {
          setKommunenavn(data.kommunenavn || "");
          setFylkesnavn(data.fylkesnavn || "");
        }
      })
      .catch(() => {});
  }, [lat, lon]);

  return (
    <>
      <div className="Turkort">
        <Link to={`/turer/${turId}`} className="TurLink">
          <div className="Hovedkort">
            <div className="turkort-bilde-wrapper">
              {bildeUrl && <img src={`${bildeUrl}?w=200&h=200&fit=fit`} alt={turNavn} className="TurBilde" />}
              {onToggleFavoritt && (
                <button
                  className="favoritt-knapp"
                  onClick={(e) =>
                    handleFavoritt(
                      e,
                      () => setVisLogginn(true),
                      () => onToggleFavoritt?.(turId),
                    )
                  }
                  aria-label={erFavoritt ? t("felles.fjern_fra_favoritter") : t("felles.legg_til_favoritter")}
                  title={erFavoritt ? t("felles.fjern_fra_favoritter") : t("felles.legg_til_favoritter")}
                >
                  {erFavoritt ? <FaHeart className="favoritt-ikon aktiv" /> : <FaRegHeart className="favoritt-ikon" />}
                </button>
              )}
            </div>
            <div className="kortbody">
              <h3 className="korttitle">{turNavn}</h3>
              {kommunenavn && (
                <p className="kommune">
                  {t("felles.kommune")}: {kommunenavn}
                </p>
              )}
              {fylkesnavn && (
                <p className="fylke">
                  {t("felles.fylke")}: {fylkesnavn}
                </p>
              )}
              <p className="korttext">
                {getTurtypeIcon()} {t(`enums.vanskelighetsgrad.${vanskelighetsgrad}`)}
              </p>
              <p className="korttext">
                <FaClock className="kortklokke" /> {t(`enums.varighet.${varighet}`)}
              </p>
              {snittrating && (
                <p className="korttext turkort-rating">
                  <FaStar className="turkort-stjerne" /> {snittrating} / 5
                  {antallAnmeldelser > 0 && <span className="turkort-antall-anmeldelser">({antallAnmeldelser})</span>}
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>
      <Logginn show={visLogginn} onClose={() => setVisLogginn(false)} logginn={logginn} loading={loading} error={error} />
    </>
  );
}
