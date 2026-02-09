import PageWrapper from "../components/PageWrapper";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import  './HytteDetaljer.css';

export default function HytteDetaljer() {
  const { hytteId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [hytte, setHytte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHytte = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${hytteId}`);

        if (!response.ok) {
          setError(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setHytte(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHytte();
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
          <div>
            <h2>{hytte.navn}</h2>
            <p><strong>{t("felles.antall_sengeplasser")}:</strong> {hytte.sengeplasser}</p>
            <p><strong>{t("felles.lokasjon")}:</strong> {hytte.område}</p>
            <p><strong>{t("felles.betjeningsgrad")}:</strong> {hytte.betjeningsgrad}</p>
            
            <p><strong>{t("felles.adkomst")}: </strong>
              {hytte.adkomst?.map((item, index) => (
                <span key={index} className="Adkomst">{item}</span>
              ))}
            </p> 

            <p><strong>Passer for: </strong>
              {hytte.passerfor?.map((item, index) => (
                <span key={index} className="Passerfor">{item}</span>
              ))}
                </p>

            <p><strong>Tilgjengelighet: </strong>
              {hytte.tilgjengelighet?.map((item, index) => (
                <span key={index} className="Tilgjengelighet">{item}</span>
              ))}
            </p> 

            <p><strong>Flere filter: </strong>
              {hytte.flerefilter?.map((item, index) => (
                <span key={index} className="Flerefilter">{item}</span>
              ))}
            </p> 

          </div>
        )}

        {!loading && !error && !hytte && <p>{t("hytter.ikke_funnet")}</p>}
      </div>
    </PageWrapper>
  );
}
