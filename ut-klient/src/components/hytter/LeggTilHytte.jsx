import { useTranslation } from "react-i18next";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useFetchHytter } from "../../hooks/useFetchHytter";
import HytteForm from "./hytte-form/HytteForm";

// Oppretter en ny hytte. Laget av Olai.
export default function LeggTilHytte({ onSuccess }) {
    const { t } = useTranslation();
    const { token } = useAutentisering({ autoFetch: true });
    const { opprettHytte, loading, error } = useFetchHytter({ token });

    const handleOpprett = async (formData) => {
        try {
            await opprettHytte({
                hytte_navn: formData.navn,
                hytte_beskrivelse: formData.beskrivelse,
                hytte_sengeplasser: formData.sengeplasser,
                hytte_pris: formData.pris,
                fylke_nummer: formData.fylkeId,
                kommune_nummer: formData.kommuneId,
                hytte_breddegrad: formData.koordinat[0],
                hytte_lengdegrad: formData.koordinat[1],
                hytte_moh: formData.moh,
                hytte_betjeningsgrad: formData.betjeningsgrad,
                info_tab: formData.fasiliteter.length > 0 ? formData.fasiliteter.map((f) => f.id) : null,
                bilder: formData.bilder.length > 0 ? formData.bilder : null,
            });
            alert(t("hytter.lagt_til"));
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Error: ', err);
        }
    };

    return (
        <div>
            <h2>{t("hytter.legg_til")}</h2>
            {loading && <p>{t("hytter.legger_til")}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <HytteForm
                onSubmitAction={handleOpprett}
                buttonTekst={loading ? t("hytter.legger_til") : t("hytter.legg_til_knapp")}
            />
        </div>
    );
}