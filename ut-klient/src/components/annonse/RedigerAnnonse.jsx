import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useFetchAnnonser } from "../../hooks/useFetchAnnonser";
import AnnonseForm from "./annonse-form/AnnonseForm";

// Lar bruker søke opp en annonse, hente eksisterende data og oppdatere den. Laget av Olai.
export default function RedigerAnnonse({ onSuccess }) {
    const { t } = useTranslation();
    const { token } = useAutentisering({ autoFetch: true });
    const { annonser, loadingAnnonser, errorAnnonser, hentAnnonseFraId, oppdaterAnnonse } = useFetchAnnonser({ autoFetch: true, token });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lagretData, setLagretData] = useState(null);

    // Filtrerer søkeresultat på annonse-ID eller tittel.
    const filteredAnnonser = annonser.filter(a =>
        a.annonse_id?.toString().includes(searchTerm) ||
        a.tittel?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (!selectedId) {
            setLagretData(null);
            return;
        }

        // Henter valgt annonse og mapper API-format til feltene AnnonseForm forventer.
        const lastAnnonseData = async () => {
            try {
                setLoading(true);
                setError(null);

                const annonse = await hentAnnonseFraId(selectedId);

                setLagretData({
                    annonse_navn: annonse.annonse_navn || "",
                    tittel: annonse.tittel || "",
                    beskrivelse: annonse.beskrivelse || annonse.tekst || "",
                    bilde_url: annonse.bilde_url || [],
                    start_dato: annonse.start_dato || "",
                    slutt_dato: annonse.slutt_dato || "",
                    sokeord: annonse.sokeord || [],
                });
            } catch (err) {
                setError(t("annonse.feil_henting"));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        lastAnnonseData();
    }, [selectedId]);

    // Sender oppdatert annonse til backend med PUT og nullstiller skjema ved suksess.
    const handleOppdater = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            await oppdaterAnnonse(selectedId, formData);

            toast.success(t("annonse.oppdatert"));
            setLagretData(null);
            setSelectedId(null);
            setSearchTerm("");

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Error: ", err);
            toast.error(t("annonse.feil_oppdatering") + ": " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{t("annonse.rediger_tittel")}</h2>

            <div>
                <label htmlFor="annonse-search">{t("annonse.søk_og_velg")}</label>
                <input
                    type="text"
                    id="annonse-search"
                    list="annonser-rediger-list"
                    value={searchTerm}
                    maxLength={50}
                    onChange={(e) => {
                        // Velger annonse fra datalist og lagrer ID for videre henting/redigering.
                        setSearchTerm(e.target.value);
                        const matchedAnnonse = filteredAnnonser.find(
                            a => `ID: ${a.annonse_id} - ${a.tittel}` === e.target.value ||
                                a.annonse_id?.toString() === e.target.value
                        );
                        if (matchedAnnonse) {
                            setSelectedId(matchedAnnonse.annonse_id.toString());
                        } else {
                            setSelectedId(null);
                        }
                    }}
                    placeholder={t("annonse.søk_placeholder")}
                />
                <datalist id="annonser-rediger-list">
                    {filteredAnnonser.map((a) => (
                        <option key={a.annonse_id} value={`ID: ${a.annonse_id} - ${a.tittel}`} />
                    ))}
                </datalist>
            </div>

            {loadingAnnonser && <p>{t("annonse.laster")}</p>}
            {loading && <p>{t("annonse.laster_data")}</p>}
            {(error || errorAnnonser) && <p style={{ color: 'red' }}>{error || errorAnnonser}</p>}

            {selectedId && !loading && lagretData && (
                <AnnonseForm
                    key={selectedId}
                    lagretData={lagretData}
                    onSubmitAction={handleOppdater}
                    buttonTekst={loading ? t("felles.lagrer") : t("annonse.oppdater")}
                />
            )}
        </div>
    );
}
