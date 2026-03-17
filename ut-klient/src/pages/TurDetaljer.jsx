import PageWrapper from "../components/PageWrapper";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { useAutentisering } from "../hooks/useAutentisering";
import { useAnmeldelser } from "../hooks/useAnmeldelser";
import { hentKommuneData } from "../utils/geoUtils";
import AnmeldelseListe from "../components/anmeldelser/AnmeldelseListe";
import AnmeldelseSkjema from "../components/anmeldelser/AnmeldelseSkjema";
import  './TurDetaljer.css';


export default function TurDetaljer() {
  const { bruker, token } = useAutentisering({autoFetch: true});
  const { turId } = useParams();
  const {turAnmeldelser, turGjennomsnittsrating, leggTilTurAnmeldelse, slettTurAnmeldelse} = useAnmeldelser({token, turId});
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
              <p><strong>{t("felles.vanskelighetsgrad")}:</strong> {t(`enums.vanskelighetsgrad.${tur.vanskelighetsgrad}`)}</p>
            )}

            {tur.turtype && (
              <p><strong>{t("tur.turtype")}:</strong> {t(`enums.turtype.${tur.turtype}`)}</p>
            )}

            {tur.varighet && (
              <p><strong>{t("tur.varighet")}:</strong> {t(`enums.varighet.${tur.varighet}`)}</p>
            )}

            {tur.beskrivelse && (
              <p><strong>{t("tur.beskrivelse")}:</strong> {tur.beskrivelse}</p>
            )}

          </div>
        )}
        <AnmeldelseSkjema onSend={(data) => leggTilTurAnmeldelse(turId, data)} loading={loading} />
        <AnmeldelseListe
          anmeldelser={turAnmeldelser}
          gjennomsnittsrating={turGjennomsnittsrating}
          rating={"turrute_rating"}
          kommentar={"turrute_anmeldelse"}
          tid={"turrute_opprettet_tidspunkt"}
          loading={loading}
          error={error}
          brukerId={bruker?.bruker_id}
          onSlett={slettTurAnmeldelse(turId, bruker?.bruker_id)}
        />

        {!loading && !error && !tur && <p>{t("turer.ikke_funnet")}</p>}
      </div>
    </PageWrapper>
  );
}
