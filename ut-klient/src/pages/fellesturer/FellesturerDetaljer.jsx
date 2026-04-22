/*
Laget av Kay og Eivind
*/
import { useState, useEffect } from "react";
import PageWrapper from "../../components/PageWrapper";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFellestur } from "../../hooks/useFellesturer";
import "./FellesturerDetaljer.css";
import { usePåmelding } from "../../hooks/usePåmelding";
import { useMeldinger } from "../../hooks/useMeldinger";
import { useAutentisering } from "../../hooks/useAutentisering";
import PåmeldingKnapper from "../../components/fellesturer/påmelding/PåmeldingKnapper";
import { formatFellesturDato } from "../../utils/datoUtils";
import { DATO_STATUS } from "../../constants/konstanter";
import { VærvarslingUke } from "../../components/Værvarsling";
import EmblaCarousel from "../../components/EmblaCarousel";

//Detaljvisning for en fellestur. Laget av Kay
export default function FellesturerDetaljer() {
  const { fellesturId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token, bruker, erAutentisert } = useAutentisering({ autoFetch: true });
  const { fellestur, loadingFellesturer: loading, errorFellesturer: error } = useFellestur({ hentTurID: fellesturId });
  const {
    aktivitetDatoId,
    setAktivitetDatoId,
    minPåmelding,
    deltakerePerDato,
    loading: loadingPåmelding,
    meldPå,
    meldAv,
    registrerBildesamtykke,
  } = usePåmelding({ token: erAutentisert ? token : null, aktivitetId: fellesturId });
  const { hentEllerOpprettDirekte } = useMeldinger({ token: erAutentisert ? token : null });
  const maksDeltakere = fellestur?.aktivitet_maks_deltakere ?? null;
  const [visVærmelding, setVisVærmelding] = useState(false);

  const valgtDato = fellestur?.datoer?.find((d) => d.aktivitet_dato_status === DATO_STATUS.VALGT) ?? null;
  const synligeDatoer = fellestur?.datoer?.filter((d) => d.aktivitet_dato_status !== DATO_STATUS.AVLYST) ?? [];
  const erRabattGyldig = fellestur?.rabatt_frist ? new Date(fellestur.rabatt_frist) > new Date() : false;

  useEffect(() => {
    if (valgtDato) setAktivitetDatoId(valgtDato.aktivitet_dato_id);
  }, [valgtDato, setAktivitetDatoId]);

  const ledigePlasserForDato = (aktivitet_dato_id) => {
    if (maksDeltakere == null) return null;
    return maksDeltakere - (deltakerePerDato[aktivitet_dato_id]?.bindende ?? 0);
  };

  const handleKontaktTurleder = async () => {
    if (!erAutentisert || !fellestur?.oppretter?.bruker_id) return;
    const samtale = await hentEllerOpprettDirekte(fellestur.oppretter?.bruker_id);
    if (samtale) navigate("/meldinger", { state: { samtale } });
  };

//Endret for å passe stil, av Eivind 
  return (
    <PageWrapper>
      <div className="fellesturer FellesturerDetaljerSide">
        <button className="TilbakeKnapp" onClick={() => navigate("/fellesturer")}>
          {t("fellesturer.tilbake_til_fellesturer")}
        </button>

        <Link to={`/navigasjon/fellestur/${fellesturId}`} className="navigasjon-knapp">
          Naviger turen
        </Link>

        {loading && <p>{t("fellesturer.laster")}</p>}

        {error && console.log(`Error: ${error}`)}

        {!loading && !error && fellestur && (
          <div className="fellestur-detaljer">
            <h2>{fellestur.aktivitet_tittel}</h2>

            {fellestur.bilder && fellestur.bilder.length > 0 && <EmblaCarousel slides={fellestur.bilder} options={{ loop: true }} />}

            <div className="fellestur-info">
              {fellestur.aktivitet_beskrivelse && (
                <p>
                  <strong>{t("tur.beskrivelse")}:</strong> {fellestur.aktivitet_beskrivelse}
                </p>
              )}

              {fellestur.aktivitet_status && (
                <p>
                  <strong>Status:</strong> {t(`enums.aktivitet_status.${fellestur.aktivitet_status}`)}
                </p>
              )}

              {fellestur.aktivitet_min_deltakere && (
                <p>
                  <strong>{t("fellestur_form.min_deltakere")}:</strong> {fellestur.aktivitet_min_deltakere}
                </p>
              )}

              {fellestur.aktivitet_maks_deltakere && (
                <p>
                  <strong>{t("fellestur_form.maks_deltakere")}:</strong> {fellestur.aktivitet_maks_deltakere}
                </p>
              )}

              {fellestur.turtype && (
                <p>
                  <strong>Turtype :</strong> {fellestur.turtype}
                </p>
              )}

              {fellestur.vanskelighetsgrad && (
                <p>
                  <strong>Vanskelighetsgrad :</strong> {fellestur.vanskelighetsgrad}
                </p>
              )}

              {fellestur.varighet && (
                <p>
                  <strong>Varighet :</strong> {fellestur.varighet}
                </p>
              )}

              {fellestur.lengde && (
                <p>
                  <strong>Rutelengde :</strong> {fellestur.lengde.toFixed(2)} KM
                </p>
              )}

              {fellestur.pris && (
                <p>
                  <strong>Pris :</strong> {fellestur.pris} Kr
                </p>
              )}

              {fellestur.rabatt_frist && erRabattGyldig && (
                <>
                  {fellestur.rabatt_pris && (
                    <p>
                      <strong>Pris med rabatt :</strong> {fellestur.rabatt_pris} Kr
                    </p>
                  )}

                  {fellestur.rabatt_frist && (
                    <p>
                      <strong>Siste frist for rabatt :</strong> {formatFellesturDato(fellestur.rabatt_frist)}
                    </p>
                  )}
                </>
              )}
            </div>
            {erAutentisert && (
              <>
                {fellestur.oppretter?.bruker_id && fellestur.oppretter?.bruker_id !== bruker?.bruker_id && (
                  <button className="kontakt-turleder-btn" onClick={handleKontaktTurleder}>
                    Kontakt turleder
                  </button>
                )}

                <hr />

                {/*Startdato + sluttdato + ledige plasser*/}
                {synligeDatoer.length > 0 && (
                  <div>
                    <strong>{valgtDato ? "Bekreftet dato:" : "Velg en dato for påmelding:"}</strong>
                    <ul className="dato-liste">
                      {synligeDatoer.map((dato) => {
                        const erValgt = dato.aktivitet_dato_status === DATO_STATUS.VALGT;
                        const ledige = ledigePlasserForDato(dato.aktivitet_dato_id);
                        return (
                          <li
                            key={dato.aktivitet_dato_id}
                            className={`dato-valg${aktivitetDatoId === dato.aktivitet_dato_id ? " valgt" : ""}${erValgt ? " dato-bekreftet" : ""}`}
                            onClick={() => !erValgt && setAktivitetDatoId(dato.aktivitet_dato_id)}
                          >
                            {formatFellesturDato(dato.aktivitet_start_dato)}
                            {dato.aktivitet_slutt_dato && ` – ${formatFellesturDato(dato.aktivitet_slutt_dato)}`}
                            {dato.er_last_for_pamelding && <strong className="dato-stengt"> · Påmelding stengt</strong>}

                            {ledige !== null && !dato.er_last_for_pamelding && (
                              <>
                                <span>&nbsp;</span>
                                <strong className="dato-ledige-plasser">
                                  {ledige > 0 ? `(resterende plasser: ${ledige})` : " · Fullt"}
                                </strong>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/*Påmelding/meld interesse*/}
                <PåmeldingKnapper
                  aktivitetDatoId={aktivitetDatoId}
                  minPåmelding={minPåmelding}
                  ledigePlasser={ledigePlasserForDato(aktivitetDatoId)}
                  antallInteresserteDeltakere={deltakerePerDato[aktivitetDatoId]?.interessert ?? 0}
                  loading={loadingPåmelding}
                  meldPå={meldPå}
                  meldAv={meldAv}
                  registrerBildesamtykke={registrerBildesamtykke}
                  erLastForPamelding={synligeDatoer.find((d) => d.aktivitet_dato_id === aktivitetDatoId)?.er_last_for_pamelding ?? false}
                />
              </>
            )}
            {fellestur.stier?.[0]?.sti_punkter?.[0] && (
              <>
                <hr />
                <button className="værmelding-toggle" onClick={() => setVisVærmelding((v) => !v)}>
                  Værmelding {visVærmelding ? "▲" : "▼"}
                </button>

                {visVærmelding && (
                  <VærvarslingUke
                    latitude={fellestur.stier[0].sti_punkter[0].breddegrad}
                    longitude={fellestur.stier[0].sti_punkter[0].lengdegrad}
                  />
                )}
              </>
            )}
          </div>
        )}

        {!loading && !error && !fellestur && <p>{t("fellesturer.ikke_funnet")}</p>}
      </div>
    </PageWrapper>
  );
}
