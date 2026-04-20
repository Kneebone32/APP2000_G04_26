import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBed, FaMoneyCheckAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import "./Hyttekort.css";
import { handleFavoritt } from "../Favoritt";
import { useAutentisering } from "../../hooks/useAutentisering";
import Logginn from "../autentisering/Logginn";

// Viser et klikkbart hyttekort med bilde, sted, sengeplasser og eventuell pris. Laget av Olai og Eivind.
export default function HytteKort({ hytteId, hytteNavn, sengeplasser, bildeUrl, pris, fylkeId, kommuneId, erFavoritt, onToggleFavoritt }) {
  const { t } = useTranslation();
  const { logginn, loading, error } = useAutentisering({ autoFetch: false });
  const [visLogginn, setVisLogginn] = useState(false);

  return (
    <>
      <div className="Hyttekort">
        <Link to={`/hytter/${hytteId}`} className="Hyttelink">
          <div className="Hovedkort">
            <div className="hyttekort-bilde-wrapper">
              {bildeUrl && (
                <img
                  // Legger på bildeparametre for simple-file-upload URL-er for mindre forhåndsvisning.
                  src={bildeUrl.includes("simplefileupload") ? `${bildeUrl}?w=200&h=200&fit=fit` : bildeUrl}
                  alt={hytteNavn}
                  className="Hyttebilde"
                />
              )}
              {onToggleFavoritt && (
                <button
                  className="favoritt-knapp"
                  onClick={(e) =>
                    handleFavoritt(
                      e,
                      () => setVisLogginn(true),
                      () => onToggleFavoritt?.(hytteId),
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
              <h3 className="korttitle">{hytteNavn}</h3>
              <p className="kommune">
                {t("felles.kommune")}: {kommuneId}
              </p>
              <p className="fylke">
                {t("felles.fylke")}: {fylkeId}
              </p>
              <p className="korttext">
                {" "}
                <FaBed className="seng" /> {sengeplasser} {t("felles.antall_sengeplasser")}
              </p>
              {pris !== undefined && (
                <p className="korttext">
                  {" "}
                  <FaMoneyCheckAlt className="penger" /> {pris} {t("hytter.pris")}
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
