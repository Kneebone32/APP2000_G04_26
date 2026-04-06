import PageWrapper from "../../components/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFellestur } from "../../hooks/useFellesturer";
import { usePåmelding } from "../../hooks/usePåmelding";
import { useAutentisering } from "../../hooks/useAutentisering";
import PåmeldingKnapper from "../../components/fellesturer/påmelding/PåmeldingKnapper";
import { formatFellesturDato } from "../../utils/datoUtils";

//Detaljvisning for en fellestur. Laget av Kay
export default function FellesturerDetaljer() {
    const { fellesturId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { token, erAutentisert } = useAutentisering({ autoFetch: true });
    const { fellestur, loadingFellesturer: loading, errorFellesturer: error } = useFellestur({hentTurID: fellesturId});
    const { aktivitetDatoId, setAktivitetDatoId, minPåmelding, deltakerePerDato, loading: loadingPåmelding, meldPå, meldAv } = usePåmelding({token: erAutentisert ? token : null, aktivitetId: fellesturId});
    const maksDeltakere = fellestur?.aktivitet_maks_deltakere ?? null;

    const ledigePlasserForDato = (aktivitet_dato_id) => {
        if (maksDeltakere == null) return null;
        return maksDeltakere - (deltakerePerDato[aktivitet_dato_id]?.bindende ?? 0);
    };

    return (
        <PageWrapper>
            <div className="fellestur-detaljer">
                <button className="TilbakeKnapp" onClick={() => navigate("/fellesturer")}>
                    {t("fellesturer.tilbake_til_fellesturer")}
                </button>

                {loading && <p>{t("fellesturer.laster")}</p>}

                {error && console.log(`Error: ${error}`)}

                {!loading && !error && fellestur && (
                    <div>
                        <h2>{fellestur.aktivitet_tittel}</h2>

                        {fellestur.bilder?.length > 0 && (
                            <div className="fellestur-bilder">
                                {fellestur.bilder.map((bilde, index) => (
                                    <img
                                        key={index}
                                        src={bilde.aktivitet_url}
                                        alt={`${fellestur.aktivitet_tittel} bilde ${index + 1}`}
                                        className="fellestur-bilde"
                                    />
                                ))}
                            </div>
                        )}

                        {fellestur.aktivitet_beskrivelse && (
                            <p><strong>{t("tur.beskrivelse")}:</strong> {fellestur.aktivitet_beskrivelse}</p>
                        )}

                        {fellestur.aktivitet_status && (
                            <p><strong>Status:</strong> {t(`enums.aktivitet_status.${fellestur.aktivitet_status}`)}</p>
                        )}

                        {fellestur.aktivitet_min_deltakere && (
                            <p><strong>{t("fellestur_form.min_deltakere")}:</strong> {fellestur.aktivitet_min_deltakere}</p>
                        )}

                        {fellestur.aktivitet_maks_deltakere && (
                            <p><strong>{t("fellestur_form.maks_deltakere")}:</strong> {fellestur.aktivitet_maks_deltakere}</p>
                        )}

                        {fellestur.turtype && (
                            <p><strong>Turtype :</strong> {fellestur.turtype}</p>
                        )}

                        {fellestur.vanskelighetsgrad && (
                            <p><strong>Vanskelighetsgrad :</strong> {fellestur.vanskelighetsgrad}</p>
                        )}

                        {fellestur.varighet && (
                            <p><strong>Varighet :</strong> {fellestur.varighet}</p>
                        )}

                        <hr />
                        {/*Startdato + sluttdato + ledige plasser*/}
                        {fellestur.datoer?.length > 0 && (
                            <div>
                                <strong>Velg en dato for påmelding:</strong>
                                <ul className="dato-liste">
                                    {fellestur.datoer.map((dato) => {
                                        const ledige = ledigePlasserForDato(dato.aktivitet_dato_id);
                                        return (
                                            <li
                                                key={dato.aktivitet_dato_id}
                                                className={`dato-valg${aktivitetDatoId === dato.aktivitet_dato_id ? ' valgt' : ''}`}
                                                onClick={() => setAktivitetDatoId(dato.aktivitet_dato_id)}
                                            >
                                                {formatFellesturDato(dato.aktivitet_start_dato)}
                                                {dato.aktivitet_slutt_dato && ` – ${formatFellesturDato(dato.aktivitet_slutt_dato)}`}
                                                {ledige !== null && (
                                                    <>
                                                    <span>&nbsp;</span>
                                                    <strong className="dato-ledige-plasser">
                                                        {ledige > 0 ? `(resterende plasser: ${ledige})` : ' · Fullt'}
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
                        />
                    </div>
                )}

                {!loading && !error && !fellestur && <p>{t("fellesturer.ikke_funnet")}</p>}
            </div>
        </PageWrapper>
    );
}
