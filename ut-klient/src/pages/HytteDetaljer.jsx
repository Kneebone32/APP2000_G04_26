import PageWrapper from "../components/PageWrapper";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAutentisering } from '../hooks/useAutentisering';
import { useFetchHytter } from "../hooks/useFetchHytter";
import { useAnmeldelser } from "../hooks/useAnmeldelser";
import AnmeldelseListe from "../components/anmeldelser/AnmeldelseListe";
import AnmeldelseSkjema from "../components/anmeldelser/AnmeldelseSkjema";
import  './HytteDetaljer.css';

// Viser detaljside for én valgt hytte basert på ID fra URL. Laget av Olai
export default function HytteDetaljer() {
  const { bruker, token, erAutentisert } = useAutentisering({autoFetch: true});
  const { hytteId } = useParams();
  const {hytteAnmeldelser, hytteGjennomsnittsrating, leggTilHytteAnmeldelse, slettHytteAnmeldelse} = useAnmeldelser({token, hytteId});
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hentHytteFraId } = useFetchHytter(false);
  const [hytte, setHytte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Trekker ut navn på fasiliteter fra kategoristrukturen på hytta.
  const fasiliteterNavn = Array.isArray(hytte?.kategorier)
    ? hytte.kategorier
        .filter((kategori) =>
          String(kategori?.kategori || kategori?.kategori_navn || "")
            .toLowerCase()
            .includes("fasilitet")
        )
        .flatMap((kategori) => Array.isArray(kategori?.items) ? kategori.items : [])
        .map((fasilitet) => fasilitet?.navn)
        .filter(Boolean)
    : [];

  useEffect(() => {
    // Henter hyttedata når ID i URL endres.
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
            <h2>{hytte.hytte_navn || hytte.navn}</h2>

            {hytte.bilder && hytte.bilder.length > 0 && (
              <div className="hytte-bilder">
                {hytte.bilder.map((bilde, index) => (
                  <img
                    key={index}
                    src={typeof bilde === "string" ? bilde : bilde?.url}
                    alt={`${hytte.navn} bilde ${index + 1}`}
                    className="hytte-bilde"
                  />
                ))}
              </div>
            )}

            {(hytte.hytte_omrade || hytte.omrade) && (
              <p><strong>{t("felles.lokasjon")}:</strong> {hytte.hytte_omrade || hytte.omrade}</p>
            )}

            {hytte.koordinater?.moh && (
              <p><strong>{t("hytte.hytte_moh")}:</strong> {hytte.koordinater?.moh}</p>
            )}

            {hytte.fylke && (
              <p><strong>{t("felles.fylke")}:</strong> {hytte.fylke}</p>
            )}

            {hytte.kommune && (
              <p><strong>{t("felles.kommune")}:</strong> {hytte.kommune}</p>
            )}

            {(hytte.hytte ?? hytte.hytte_pris ?? hytte.pris) !== undefined && (
              <p><strong>{t("hytte.pris")}:</strong> {hytte.hytte ?? hytte.hytte_pris ?? hytte.pris}</p>
            )}

            {hytte.betjeningsgrad && (
              <p><strong>{t("hytte.hytte_betjeningsgrad")}:</strong> {t(`enums.betjeningsgrad.${hytte.betjeningsgrad}`)}</p>
            )}

            {hytte.beskrivelse && (
              <p><strong>{t("hytte.beskrivelse")}:</strong> {hytte.beskrivelse}</p>
            )}

            {fasiliteterNavn.length > 0 && (
              <p><strong>{t("hytter.fasiliteter")}:</strong> {fasiliteterNavn.join(", ")}</p>
            )}

          </div>
        )}

        {erAutentisert && (
          <AnmeldelseSkjema onSend={(data) => leggTilHytteAnmeldelse(hytteId, data)} loading={loading} />
        )}

        <hr />
        
        <AnmeldelseListe
          anmeldelser={hytteAnmeldelser}
          gjennomsnittsrating={hytteGjennomsnittsrating}
          rating={"hytte_rating"}
          kommentar={"hytte_anmeldelse"}
          tid={"hytte_opprettet_tidspunkt"}
          loading={loading}
          error={error}
          brukerId={bruker?.bruker_id}
          onSlett={slettHytteAnmeldelse(hytteId, bruker?.bruker_id)}
        />

        {!loading && !error && !hytte && <p>{t("hytter.ikke_funnet")}</p>}
      </div>
    </PageWrapper>
  );
}