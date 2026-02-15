import PageWrapper from "../components/PageWrapper";
import TurKort from "../components/TurKort";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Hytter.css";

export default function Turer() {
  const [turer, setTurer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTurer = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/turer`);

        if (!response.ok) {
          setError(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTurer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTurer();
  }, []);

  return (
    <PageWrapper title={t("turer.tittel")}>
      <div className="mt-3">
        {loading && <p>{t("turer.laster")}</p>}

        {error && console.log(`Error: ${error}`)}

        {!loading && !error && turer.length === 0 && (
          <p>{t("turer.ingen_turer")}</p>
        )}

        {!loading && !error && turer.length > 0 && (
          <div className="TurkortContainer">
            {turer.map((tur) => (
              <TurKort
                key={tur.tur_id}
                turId={tur.tur_id}
                turNavn={tur.tur_navn}
                vanskelighetsgrad={tur.vanskelighetsgrad}
                bildeUrl={tur.turbilde_url}
              />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
