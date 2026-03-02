import PageWrapper from "../components/PageWrapper";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { hentKommuneData } from "../utils/geoUtils";
import  './TurDetaljer.css';

export default function TurDetaljer() {
  const { turId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hentTurFraId } = useFetchTurer(false);
  const [tur, setTur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kommunenavn, setKommunenavn] = useState("");
  const [fylkesnavn, setFylkesnavn] = useState("");


  useEffect(() => {
    const hentTur = async () => {
      try {
        const [data, punkter] = await Promise.all([
          hentTurFraId(turId),
          fetch(`${import.meta.env.VITE_API_URL}/turruter/${turId}/punkter`).then(r => r.json())
        ]);
        setTur(data);

        if (punkter && punkter.length >= 1) {
          try {
            const kommuneData = await hentKommuneData(punkter[0][0], punkter[0][1]);
            if (kommuneData) {
              setKommunenavn(kommuneData.kommunenavn || "");
              setFylkesnavn(kommuneData.fylkesnavn || "");
            }
          } catch (err) {
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    hentTur();
  }, [turId]);

  return (
    <PageWrapper>
      <div className="Turer">
        <button 
          className="TilbakeKnapp" 
          onClick={() => navigate("/turer")}
        >
          {t("turer.tilbake_til_turer")}
        </button>

        {loading && <p>{t("turer.laster_detaljer")}</p>}

        {error && (
          console.log(`Error: ${error}`)
        )}

        {!loading && !error && tur && (
          <div className="tur-detaljer">
            <h2>{tur.turrute_navn}</h2>

            {tur.bilder && tur.bilder.length > 0 && (
              <div className="tur-bilder">
                {tur.bilder.map((bilder, index) => (
                  <img
                    key={index}
                    src={bilder}
                    alt={`${tur.turrute_navn} bilde ${index + 1}`}
                    className="tur-bilde"
                  />
                ))}
              </div>
            )}

            {tur.turrute_omrade && (
              <p><strong>{t("felles.lokasjon")}:</strong> {tur.turrute_omrade}</p>
            )}

            {kommunenavn && (
              <p><strong>{t("felles.kommune")}:</strong> {kommunenavn}</p>
            )}

            {fylkesnavn && (
              <p><strong>{t("felles.fylke")}:</strong> {fylkesnavn}</p>
            )}

            {tur.vanskelighetsgrad && (
              <p><strong>{t("felles.vanskelighetsgrad")}:</strong> {tur.vanskelighetsgrad}</p>
            )}

            {tur.turtype && (
              <p><strong>{t("tur.turtype")}:</strong> {tur.turtype}</p>
            )}

            {tur.varighet && (
              <p><strong>{t("tur.varighet")}:</strong> {tur.varighet}</p>
            )}

            {tur.beskrivelse && (
              <p><strong>{t("tur.beskrivelse")}:</strong> {tur.beskrivelse}</p>
            )}

          </div>
        )}

        {!loading && !error && !tur && <p>{t("turer.ikke_funnet")}</p>}
      </div>
    </PageWrapper>
  );
}
