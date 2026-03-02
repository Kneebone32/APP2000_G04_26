import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFetchTurer } from "../../hooks/useFetchTurer";
import { useEnums } from "../../hooks/useEnums";
import { useModal } from "../../hooks/useModal";
import { hentKommuneData } from "../../utils/geoUtils";
import Modal from "../../modal/Modal";
import Nytur from "../Nytur";

// Redigerer en eksisterende tur ved å først søke den opp
export default function RedigerTur({ onSuccess }) {
    const { t } = useTranslation();
    const { turer, hentTurFraId, opptaterTur } = useFetchTurer(true);
    const { enumData: vanskelighetsgrad } = useEnums("vanskelighetsgrad_enum");
    const { enumData: turtype } = useEnums("turtype_enum");
    const { enumData: varighet } = useEnums("varighet_enum");
    const { isOpen, open, close } = useModal();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [navn, setNavn] = useState("");
    const [selectedVanskelighetsgrad, setSelectedVanskelighetsgrad] = useState("");
    const [selectedTurtype, setSelectedTurtype] = useState("");
    const [selectedVarighet, setSelectedVarighet] = useState("");
    const [beskrivelse, setBeskrivelse] = useState("");
    const [fylke, setFylke] = useState("");
    const [fylkeId, setFylkeId] = useState(null);
    const [kommune, setKommune] = useState("");
    const [kommuneId, setKommuneId] = useState(null);
    const [rutePunkter, setRutePunkter] = useState([]);
    const [lagredeKoordinater, setLagredeKoordinater] = useState(null);

    const filteredTurer = turer.filter(tur =>
        tur.turrute_id?.toString().includes(searchTerm) ||
        tur.turrute_navn?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Henter turdata og eksisterende rute når en tur velges
    useEffect(() => {
        if (!selectedId) return;

        const lastTurData = async () => {
            try {
                setLoading(true);
                setError(null);
                setLagredeKoordinater(null);
                setRutePunkter([]);

                const [tur, punkterRes] = await Promise.all([
                    hentTurFraId(selectedId),
                    fetch(`${import.meta.env.VITE_API_URL}/turruter/${selectedId}/punkter`).then(r => r.json())
                ]);

                setNavn(tur.turrute_navn || "");
                setSelectedVanskelighetsgrad(tur.vanskelighetsgrad || "");
                setSelectedTurtype(tur.turtype || "");
                setSelectedVarighet(tur.varighet || "");
                setBeskrivelse(tur.beskrivelse || "");
                setFylkeId(tur.fylke_id ?? null);
                setKommuneId(tur.kommune_id ?? null);

                if (punkterRes && punkterRes.length >= 2) {
                    setRutePunkter(punkterRes);
                    setLagredeKoordinater(punkterRes);

                    // Hent visningsnavn for fylke og kommune basert på startpunktet
                    try {
                        const kommuneData = await hentKommuneData(punkterRes[0][0], punkterRes[0][1]);
                        if (kommuneData) {
                            setFylke(kommuneData.fylkesnavn || "");
                            setKommune(kommuneData.kommunenavn || "");
                        }
                    } catch (err) {
                        console.error("Feil ved henting av kommune/fylke:", err);
                    }
                }
            } catch (err) {
                setError(t("tur.feil_henting_melding"));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        lastTurData();
    }, [selectedId]);

    // Kalles når bruker lagrer ny rute fra kartet
    const handleLagreKoordinater = async (koords) => {
        if (koords && koords.length >= 2) {
            setLagredeKoordinater(koords);
            setRutePunkter(koords);

            try {
                const kommuneData = await hentKommuneData(koords[0][0], koords[0][1]);
                if (kommuneData) {
                    setFylke(kommuneData.fylkesnavn || "");
                    setKommune(kommuneData.kommunenavn || "");
                }
            } catch (err) {
                console.error("Feil ved henting av kommune/fylke:", err);
            }

            close();
        } else {
            alert(t("tur.velg_minst_to_punkter"));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedId) {
            alert(t("tur.velg_tur_redigering"));
            return;
        }

        if (!navn.trim() || !selectedVanskelighetsgrad || !selectedTurtype || !selectedVarighet) {
            alert(t("tur.fyll_ut_felt"));
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await opptaterTur(selectedId, {
                turrute_navn: navn,
                beskrivelse: beskrivelse,
                vanskelighetsgrad: selectedVanskelighetsgrad,
                varighet: selectedVarighet,
                turtype: selectedTurtype,
                fylke_id: fylkeId ?? 4,
                kommune_id: kommuneId ?? 2,
                punkter: lagredeKoordinater || undefined
            });

            alert(t("tur.tur_oppdatert"));

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
                            tur => `ID: ${tur.turrute_id} - ${tur.turrute_navn}` === e.target.value
                        );
                        if (matchedTur) {
                            setSelectedId(matchedTur.turrute_id.toString());
                        } else {
                            setSelectedId(null);
                        }
                    }}
                    placeholder={t("tur.søk_placeholder")}
                />
                <datalist id="turer-rediger-list">
                    {filteredTurer.map((tur) => (
                        <option key={tur.turrute_id} value={`ID: ${tur.turrute_id} - ${tur.turrute_navn}`} />
                    ))}
                </datalist>
            </div>

            {loading && <p>{t("tur.laster_turdata")}</p>}

            {selectedId && !loading && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="navn">{t("felles.navn")}:</label>
                        <input
                            type="text"
                            id="navn"
                            value={navn}
                            onChange={(e) => setNavn(e.target.value)}
                            pattern="^[A-Za-zØÆÅøæå\s]{3,20}$"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="vanskelighetsgrad">{t("tur.vanskelighetsgrad")}:</label>
                        <select
                            id="vanskelighetsgrad"
                            value={selectedVanskelighetsgrad}
                            onChange={(e) => setSelectedVanskelighetsgrad(e.target.value)}
                            required
                        >
                            <option value="" disabled hidden></option>
                            {vanskelighetsgrad.map((valg) => (
                                <option key={valg} value={valg}>{valg}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="turtype">{t("tur.turtype")}:</label>
                        <select
                            id="turtype"
                            value={selectedTurtype}
                            onChange={(e) => setSelectedTurtype(e.target.value)}
                            required
                        >
                            <option value="" disabled hidden></option>
                            {turtype.map((valg) => (
                                <option key={valg} value={valg}>{valg}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="varighet">{t("tur.varighet")}:</label>
                        <select
                            id="varighet"
                            value={selectedVarighet}
                            onChange={(e) => setSelectedVarighet(e.target.value)}
                            required
                        >
                            <option value="" disabled hidden></option>
                            {varighet.map((valg) => (
                                <option key={valg} value={valg}>{valg}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>{t("tur.koordinater_start_slutt")}:</label>
                        <div>
                            <button type="button" onClick={open}>
                                {t("tur.endre_rute")}
                            </button>
                        </div>
                        {lagredeKoordinater && lagredeKoordinater.length >= 2 && (
                            <div style={{ marginTop: '10px' }}>
                                <p>✓ {t("tur.rute_lagret")} {lagredeKoordinater.length} {t("tur.punkter")}</p>
                                <p>{t("tur.start")}: {lagredeKoordinater[0][0].toFixed(5)}, {lagredeKoordinater[0][1].toFixed(5)}</p>
                                <p>{t("tur.slutt")}: {lagredeKoordinater[lagredeKoordinater.length - 1][0].toFixed(5)}, {lagredeKoordinater[lagredeKoordinater.length - 1][1].toFixed(5)}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="fylke">{t("felles.fylke")}:</label>
                        <input
                            type="text"
                            id="fylke"
                            value={fylke}
                            readOnly
                            placeholder={t("tur.fylke_automatisk")}
                        />
                    </div>

                    <div>
                        <label htmlFor="kommune">{t("felles.kommune")}:</label>
                        <input
                            type="text"
                            id="kommune"
                            value={kommune}
                            readOnly
                            placeholder={t("tur.kommune_automatisk")}
                        />
                    </div>

                    <div>
                        <label htmlFor="beskrivelse">{t("tur.beskrivelse")}:</label>
                        <input
                            type="text"
                            id="beskrivelse"
                            value={beskrivelse}
                            onChange={(e) => setBeskrivelse(e.target.value)}
                            pattern="^[0-9A-Za-zØÆÅøæå\s]{3,150}$"
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? t("tur.oppdaterer") : t("tur.oppdater_knapp")}
                    </button>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            )}

            <Modal show={isOpen} onClose={close} size="lg">
                <div className="modal-map-container">
                    <Nytur
                        rutePunkter={rutePunkter}
                        setRutePunkter={setRutePunkter}
                        onLagreKoordinater={handleLagreKoordinater}
                    />
                </div>
            </Modal>
        </div>
    );
}
