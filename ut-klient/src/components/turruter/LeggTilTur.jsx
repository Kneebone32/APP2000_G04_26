import { useTranslation } from "react-i18next";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useFetchTurer } from "../../hooks/useFetchTurer";
import TurForm from "./tur-form/TurForm";

// Oppretter en ny tur. Laget av Olai.
export default function LeggTilTur({ onSuccess }) {
    const { t } = useTranslation();
    const { token } = useAutentisering({ autoFetch: true });
    const { opprettTur, loadingTurer: loading, errorTurer: error } = useFetchTurer({ token });

    const handleOpprett = async (formData) => {
        try {
            await opprettTur({
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
                nyeStier: formData.nyeStier,
                gpx: formData.gpx,
                ruteLengde: formData.ruteLengde,
            });
            alert(t("tur.tur_lagt_til"));
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Error: ', err);
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
