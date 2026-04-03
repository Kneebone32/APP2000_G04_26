import { useState } from "react";
import { useTranslation } from "react-i18next";
import TurForm from "./tur-form/TurForm";

// Oppretter en ny tur. Laget av Olai.
export default function LeggTilTur({ onSuccess }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOpprett = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/tur`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tur_navn: formData.navn,
                    tur_beskrivelse: formData.beskrivelse,
                    vanskelighetsgrad: formData.vanskelighetsgrad || null,
                    varighet: formData.varighet || null,
                    turtype: formData.turtype || null,
                    fylke_id: formData.fylkeId,
                    kommune_id: formData.kommuneId,
                    punkter: formData.punkter || null,
                    info_array: null,
                    bilder: formData.bilder.length > 0 ? formData.bilder : null,
                    hytter: formData.hytter?.map(h => h.hytte_id),
                    turmaal: formData.turmaal?.map(t => t.turmaal_id),
                    stier: formData.stier,
                }),
            });

            if (!response.ok) {
                throw new Error(`${t("tur.feil_opprettelse")}: ${response.status}`);
            }

            alert(t("tur.tur_lagt_til"));
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
            <h2>{t("tur.legg_til_tur")}</h2>
            {loading && <p>{t("tur.legger_til")}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <TurForm
                onSubmitAction={handleOpprett}
                buttonTekst={loading ? t("tur.legger_til") : t("tur.legg_til_knapp")}
            />
        </div>
    );
}
