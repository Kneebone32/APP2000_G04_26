import PageWrapper from "../components/PageWrapper";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import  './TurDetaljer.css';

export default function TurDetaljer() {
  const { turId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tur, setTur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTur = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/turer/${turId}`);

        if (!response.ok) {
          setError(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setTur(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTur();
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
          <div>
            <h2>{tur.tur_navn}</h2>
            <p><strong>{t("felles.vanskelighetsgrad")}:</strong> {tur.vanskelighetsgrad}</p>
            <p><strong>{t("felles.lokasjon")}:</strong> {tur.område}</p>
            <p><strong>{t("felles.betjeningsgrad")}:</strong> {tur.betjeningsgrad}</p>
            
            <p><strong>{t("felles.adkomst")}: </strong>
              {tur.adkomst?.map((item, index) => (
                <span key={index} className="Adkomst">{item}</span>
              ))}
            </p> 

            <p><strong>{t("felles.passer_for")}: </strong>
              {tur.passerfor?.map((item, index) => (
                <span key={index} className="Passerfor">{item}</span>
              ))}
                </p>

            <p><strong>{t("felles.tilgjengelighet")}: </strong>
              {tur.tilgjengelighet?.map((item, index) => (
                <span key={index} className="Tilgjengelighet">{item}</span>
              ))}
            </p> 

            <p><strong>{t("felles.flere_filter")}: </strong>
              {tur.flerefilter?.map((item, index) => (
                <span key={index} className="Flerefilter">{item}</span>
              ))}
            </p> 

          </div>
        )}

        {!loading && !error && !tur && <p>{t("turer.ikke_funnet")}</p>}
      </div>
    </PageWrapper>
  );
}
