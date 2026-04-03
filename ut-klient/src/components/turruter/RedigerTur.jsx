import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFetchTurer } from "../../hooks/useFetchTurer";
import { hentKommuneData } from "../../utils/geoUtils";
import TurForm from "./tur-form/TurForm";

// Lar bruker søke opp en tur, hente eksisterende data og oppdatere den. Laget av Olai.
export default function RedigerTur({ onSuccess }) {
    const { t } = useTranslation();
    const { turer, hentTurFraId, opptaterTur } = useFetchTurer({ autoFetch: true });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lagretData, setLagretData] = useState(null);

    const filteredTurer = turer.filter(tur =>
        tur.tur_id?.toString().includes(searchTerm) ||
        tur.tur_navn?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (!selectedId) {
            setLagretData(null);
            return;
        }

        const lastTurData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [tur, punkterRes] = await Promise.all([
                    hentTurFraId(selectedId),
                    fetch(`${import.meta.env.VITE_API_URL}/turruter/${selectedId}/punkter`).then(r => r.ok ? r.json() : [])
                ]);

                let fylke = "";
                let kommune = "";

                if (punkterRes && punkterRes.length >= 2) {
                    try {
                        const kommuneData = await hentKommuneData(punkterRes[0][0], punkterRes[0][1]);
                        if (kommuneData) {
                            fylke = kommuneData.fylkesnavn || "";
                            kommune = kommuneData.kommunenavn || "";
                        }
                    } catch (err) {
                        console.error("Feil ved henting av kommune/fylke:", err);
                    }
                }

                setLagretData({
                    navn: tur.tur_navn || "",
                    vanskelighetsgrad: tur.vanskelighetsgrad || "",
                    turtype: tur.turtype || "",
                    varighet: tur.varighet || "",
                    beskrivelse: tur.beskrivelse || "",
                    fylke,
                    fylkeId: tur.fylke_id ?? "",
                    kommune,
                    kommuneId: tur.kommune_id ?? "",
                    rutePunkter: punkterRes && punkterRes.length >= 2 ? punkterRes : [],
                });
            } catch (err) {
                setError(t("tur.feil_henting_melding"));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        lastTurData();
    }, [selectedId]);

    const handleOppdater = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            await opptaterTur(selectedId, {
                tur_navn: formData.navn,
                beskrivelse: formData.beskrivelse,
                vanskelighetsgrad: formData.vanskelighetsgrad,
                varighet: formData.varighet,
                turtype: formData.turtype,
                fylke_id: formData.fylkeId,
                kommune_id: formData.kommuneId,
                punkter: formData.punkter || undefined,
            });

            alert(t("tur.tur_oppdatert"));
            setLagretData(null);
            setSelectedId(null);
            setSearchTerm("");

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Error: ", err);
            setError(t("tur.feil_oppdatering_melding"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{t("tur.rediger_tittel")}</h2>

            <div>
                <label htmlFor="tur-search">{t("tur.søk_og_velg")}:</label>
                <input
                    type="text"
                    id="tur-search"
                    list="turer-rediger-list"
                    value={searchTerm}
                    maxLength={50}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        const matchedTur = filteredTurer.find(
                            tur => `ID: ${tur.tur_id} - ${tur.tur_navn}` === e.target.value
                        );
                        if (matchedTur) {
                            setSelectedId(matchedTur.tur_id.toString());
                        } else {
                            setSelectedId(null);
                        }
                    }}
                    placeholder={t("tur.søk_placeholder")}
                />
                <datalist id="turer-rediger-list">
                    {filteredTurer.map((tur) => (
                        <option key={tur.tur_id} value={`ID: ${tur.tur_id} - ${tur.tur_navn}`} />
                    ))}
                </datalist>
            </div>

            {loading && <p>{t("tur.laster_turdata")}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {selectedId && !loading && lagretData && (
                <TurForm
                    key={selectedId}
                    lagretData={lagretData}
                    onSubmitAction={handleOppdater}
                    buttonTekst={t("tur.oppdater_knapp")}
                    editModus
                />
            )}
        </div>
    );
}
