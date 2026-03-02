import PageWrapper from "../components/PageWrapper";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetchHytter } from "../hooks/useFetchHytter";
import  './HytteDetaljer.css';

export default function HytteDetaljer() {
  const { hytteId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hentHytteFraId } = useFetchHytter(false);
  const [hytte, setHytte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const hentHytte = async () => {
      try {
        const data = await hentHytteFraId(hytteId);
        setHytte(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    hentHytte();
  }, [hytteId]);

  return (
    <PageWrapper>
      <div className="Hytter">
        <button 
          className="TilbakeKnapp" 
          onClick={() => navigate("/hytter")}
        >
          {t("hytter.tilbake_til_hytter")}
        </button>

        {loading && <p>{t("hytter.laster_detaljer")}</p>}

        {error && (
          console.log(`Error: ${error}`)
        )}

        {!loading && !error && hytte && (
          <div className="hytte-detaljer">
            <h2>{hytte.hytte_navn}</h2>

            {hytte.bilder && hytte.bilder.length > 0 && (
              <div className="hytte-bilder">
                {hytte.bilder.map((bilder, index) => (
                  <img
                    key={index}
                    src={bilder}
                    alt={`${hytte.hytte_navn} bilde ${index + 1}`}
                    className="hytte-bilde"
                  />
                ))}
              </div>
            )}

            {hytte.hytte_omrade && (
              <p><strong>{t("felles.lokasjon")}:</strong> {hytte.hytte_omrade}</p>
            )}

            {hytte.hytte_moh && (
              <p><strong>{t("hytte.hytte_moh")}:</strong> {hytte.hytte_moh}</p>
            )}

            {hytte.hytte_fylkeId && (
              <p><strong>{t("felles.fylke")}:</strong> {hytte.hytte_fylkeId}</p>
            )}

            {hytte.hytte_kommuneId && (
              <p><strong>{t("hytte.hytte_kommune")}:</strong> {hytte.hytte_kommuneId}</p>
            )}

            {hytte.hytte_pris && (
              <p><strong>{t("hytte.pris")}:</strong> {hytte.hytte_pris}</p>
            )}

            {hytte.hytte_betjeningsgrad && (
              <p><strong>{t("hytte.hytte_betjeningsgrad")}:</strong> {hytte.hytte_betjeningsgrad}</p>
            )}

            {hytte.hytte_beskrivelse && (
              <p><strong>{t("hytte.beskrivelse")}:</strong> {hytte.hytte_beskrivelse}</p>
            )}

          </div>
        )}

        {!loading && !error && !hytte && <p>{t("hytter.ikke_funnet")}</p>}
      </div>
    </PageWrapper>
  );
}