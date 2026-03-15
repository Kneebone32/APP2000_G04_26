import { useState } from "react";
import { useTranslation } from "react-i18next";
import HytteForm from "./hytte-form/HytteForm";

// Oppretter en ny hytte. Laget av Olai.
export default function LeggTilHytte({ onSuccess }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOpprett = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
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
                }),
            });

            if (!response.ok) {
                throw new Error(`${t("hytter.feil_opprettelse")}: ${response.status}`);
            }

            alert(t("hytter.lagt_til"));

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Error: ', err);
            setError(err.message);
        } finally {
            setLoading(false);
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