import PageWrapper from "../../components/PageWrapper";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetchTurer } from "../../hooks/useFetchTurer";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useAnmeldelser } from "../../hooks/useAnmeldelser";
import { toast } from "react-toastify";
import AnmeldelseListe from "../../components/anmeldelser/AnmeldelseListe";
import AnmeldelseSkjema from "../../components/anmeldelser/AnmeldelseSkjema";
import EmblaCarousel from "../../components/EmblaCarousel";
import './TurDetaljer.css';

// Viser detaljside for én valgt tur basert på ID fra URL. Laget av Olai
export default function TurDetaljer() {
  const { bruker, token, erAutentisert } = useAutentisering({autoFetch: true});
  const { turId } = useParams();
  const { turAnmeldelser, turGjennomsnittsrating, leggTilTurAnmeldelse, slettTurAnmeldelse } = useAnmeldelser({token, turId});
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { turDetaljer: tur, loadingTurer: loading, errorTurer: error} = useFetchTurer({ hentTurID: turId, hentTurRuteID: turId });
  const kanSkriveAnmeldelse = erAutentisert && !turAnmeldelser.some((a) => a.bruker_id === bruker?.bruker_id);


  return (
    <PageWrapper>
      <div className="Turer TurDetaljerSide">
        <button
          className="TilbakeKnapp"
          onClick={() => navigate("/turer")}
        >
          {t("turer.tilbake_til_turer")}
        </button>

        <Link to={`/navigasjon/${turId}`} className="navigasjon-knapp">
          Naviger turen
        </Link>

        {loading && <p>{t("turer.laster_detaljer")}</p>}

        {error && (
          console.log(`Error: ${error}`)
        )}

        {!loading && !error && tur && (
          <div className="tur-detaljer">
            <h2>{tur.tur_navn}</h2>

           {tur.bilder && tur.bilder.length > 0 && (
              <EmblaCarousel slides={tur.bilder} options={{ loop: true }} />
            )}

            <div className="tur-info-og-anmeldelse">
              <div className="tur-info">
                {tur.hoyeste_punkt_moh && (
                  <p><strong>Høyeste punktet på turen:</strong> {tur.hoyeste_punkt_moh} moh</p>
                )}

                {tur.stier[0]?.kommune_navn && (
                  <p><strong>{t("felles.kommune")}:</strong> {tur.stier[0]?.kommune_navn}</p>
                )}

                {tur.stier[0]?.fylke_navn && (
                  <p><strong>{t("felles.fylke")}:</strong> {tur.stier[0]?.fylke_navn}</p>
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

                {tur.tur_beskrivelse && (
                  <p><strong>{t("tur.beskrivelse")}:</strong> {tur.tur_beskrivelse}</p>
                )}

                {tur.lengde && (
                  <p><strong>Rutelengde :</strong> {tur.rute_lengde.toFixed(2)} KM</p>
                )}
              </div>

              {kanSkriveAnmeldelse && (
                <div className="tur-anmeldelse-side">
                  <AnmeldelseSkjema onSend={(data) => leggTilTurAnmeldelse(turId, data, bruker?.bruker_navn, bruker?.bruker_id)} loading={loading} />
                </div>
              )}
          </div>
        </div>
      )}

        <hr />

        <AnmeldelseListe
          anmeldelser={turAnmeldelser}
          gjennomsnittsrating={turGjennomsnittsrating}
          rating={"rating"}
          kommentar={"anmeldelse"}
          tid={"opprettet_tidspunkt"}
          loading={loading}
          error={error}
          brukerId={bruker?.bruker_id}
          onSlett={async (anmeldelseBrukerId) => {
                      await slettTurAnmeldelse(turId, anmeldelseBrukerId);
                      toast.success('Anmeldelse slettet');
                    }}
        />

        {!loading && !error && !tur && <p>{t("turer.ikke_funnet")}</p>}
      </div>
    </PageWrapper>
  );
}
