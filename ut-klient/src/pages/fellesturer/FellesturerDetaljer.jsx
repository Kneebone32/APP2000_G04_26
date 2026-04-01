import PageWrapper from "../../components/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFellestur } from "../../hooks/useFellesturer";
import { useAutentisering } from "../../hooks/useAutentisering";


//Detaljvisning for en fellestur. Laget av Kay
export default function FellesturerDetaljer() {
    const { fellesturId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { token, erAutentisert } = useAutentisering({ autoFetch: true });
    const { fellestur, loadingFellesturer: loading, errorFellesturer: error } = useFellestur({hentTurID: fellesturId});
   

    return (
        <PageWrapper>
            <div className="fellestur-detaljer">
                <button className="TilbakeKnapp" onClick={() => navigate("/fellesturer")}>
                    {t("fellesturer.tilbake")}
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

                    </div>
                )}

                {!loading && !error && !fellestur && <p>{t("fellesturer.ikke_funnet")}</p>}
            </div>
        </PageWrapper>
    );
}
