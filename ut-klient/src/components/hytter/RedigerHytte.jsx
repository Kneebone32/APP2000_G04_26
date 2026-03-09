import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useFetchHytter } from "../../hooks/useFetchHytter";
import { useEnums } from "../../hooks/useEnums";
import { useModal } from "../../hooks/useModal";
import { useFileUpload } from "../../hooks/useFileUpload";
import { useKategorier } from "../../hooks/useKategorier";
import { hentKommuneData, hentFullHøydeData } from "../../utils/geoUtils";
import { erGyldigKoordinatEttPunkt } from "../../utils/erGyldigKoordinat";
import Modal from "../../modal/Modal";
import NyttKoordinat from "../NyttKoordinat";
import FasiliteterDropdown from "../informasjon/FasiliteterDropdown";
import TempBilde from "../TempBilde";

// Redigerer en eksisterende hytte ved å først søke den opp
export default function RedigerHytte({ onSuccess }) {
    const { t } = useTranslation();
    const { hytter, hentHytteFraId } = useFetchHytter({ autoFetch: true });
    const { enumData: betjeningsgrad } = useEnums("betjeningsgrad_enum");
    const { kategorier } = useKategorier();
    const { isOpen, open, close } = useModal();
    const uploaderRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [navn, setNavn] = useState("");
    const [beskrivelse, setBeskrivelse] = useState("");
    const [sengeplasser, setSengeplasser] = useState("");
    const [pris, setPris] = useState("");
    const [selectedBetjeningsgrad, setSelectedBetjeningsgrad] = useState("");
    const [valgteFasiliteter, setValgteFasiliteter] = useState([]);
    const [koordinat, setKoordinat] = useState(null);
    const [fylke, setFylke] = useState("");
    const [fylkeId, setFylkeId] = useState("");
    const [kommune, setKommune] = useState("");
    const [kommuneId, setKommuneId] = useState("");
    const [høydeData, setHøydeData] = useState(null);
    const [bildeUrl, setBildeUrl] = useState([]);
    const [tempUrl, setTempUrl] = useState("");

    useFileUpload(setBildeUrl);

    const filteredHytter = hytter.filter(hytte =>
        hytte.hytte_id?.toString().includes(searchTerm) ||
        hytte.navn?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Henter hyttedata når en hytte velges
    useEffect(() => {
        if (!selectedId) return;

        const lastHytteData = async () => {
            try {
                setLoading(true);
                setError(null);

                const hytte = await hentHytteFraId(selectedId);

                setNavn(hytte.hytte_navn || "");
                setBeskrivelse(hytte.beskrivelse || "");
                setSengeplasser(hytte.hytte_sengeplasser ?? hytte.sengeplasser ?? "");
                setPris(hytte.hytte_pris ?? hytte.pris ?? "");
                setSelectedBetjeningsgrad(hytte.betjeningsgrad || "");
                setFylkeId(hytte.fylke_id ?? hytte.fylke_nummer ?? "");
                setKommuneId(hytte.kommune_id ?? hytte.kommune_nummer ?? "");
                setFylke(hytte.fylke || "");
                setKommune(hytte.kommune || "");

                if (hytte.koordinater) {
                    const koord = [hytte.koordinater.breddegrad, hytte.koordinater.lengdegrad];
                    setKoordinat(koord);
                    setHøydeData({ z: hytte.koordinater.moh ?? 0 });
                }

                setValgteFasiliteter(
                    hytte.info_tab && hytte.info_tab.length > 0 ? hytte.info_tab : []
                );

                setBildeUrl(
                    hytte.bilder && hytte.bilder.length > 0
                        ? hytte.bilder.map(b => b.url || b)
                        : []
                );
            } catch (err) {
                setError(t("hytter.feil_henting_melding"));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        lastHytteData();
    }, [selectedId]);

    // Kalles når bruker lagrer nytt koordinat fra kartet
    const handleLagreKoordinat = async (koord) => {
        const lokalHøydeData = await hentFullHøydeData(koord[0], koord[1]);
        const lokalKommuneData = await hentKommuneData(koord[0], koord[1]);
        setHøydeData(lokalHøydeData);

        if (lokalKommuneData) {
            setFylke(lokalKommuneData.fylkesnavn || "");
            setFylkeId(lokalKommuneData.fylkesnummer || "");
            setKommune(lokalKommuneData.kommunenavn || "");
            setKommuneId(lokalKommuneData.kommunenummer || "");
        }

        if (erGyldigKoordinatEttPunkt(lokalHøydeData, "hytte")) {
            setKoordinat(koord);
            close();
        } else {
            alert(`Terrengtypen til koordinatene er ${lokalHøydeData.terreng}. Vennligst velg gyldige koordinater`);
        }
    };

    const handleToggleFasilitet = (navn) => {
        setValgteFasiliteter(prev =>
            prev.includes(navn) ? prev.filter(f => f !== navn) : [...prev, navn]
        );
    };

    const handleLeggTilBilde = (e) => {
        e.preventDefault();
        if (tempUrl.trim() !== "") {
            setBildeUrl([...bildeUrl, tempUrl]);
            setTempUrl("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedId) {
            alert(t("hytter.velg_hytte_redigering"));
            return;
        }

        if (!navn.trim() || !sengeplasser || sengeplasser < 1 || sengeplasser > 25 || !beskrivelse.trim() || !selectedBetjeningsgrad || !koordinat || Number(pris) < 0) {
            alert(t("hytter.fyll_ut_felt"));
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${selectedId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hytte_id: Number(selectedId),
                    hytte_navn: navn,
                    hytte_beskrivelse: beskrivelse,
                    hytte_sengeplasser: parseInt(sengeplasser),
                    hytte_pris: parseFloat(pris),
                    fylke_id: fylkeId,
                    kommune_id: kommuneId,
                    hytte_breddegrad: koordinat ? koordinat[0] : null,
                    hytte_lengdegrad: koordinat ? koordinat[1] : null,
                    hytte_moh: høydeData ? Math.round(høydeData.z) : 0,
                    hytte_betjeningsgrad: selectedBetjeningsgrad,
                    info_tab: valgteFasiliteter.length > 0 ? valgteFasiliteter : null,
                    bilder: bildeUrl.length > 0 ? bildeUrl : null
                })
            });

            if (!response.ok) {
                throw new Error(`${t("hytter.feil_oppdatering")}: ${response.status}`);
            }

            alert(t("hytter.hytte_oppdatert"));

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Error: ", err);
            setError(t("hytter.feil_oppdatering_melding"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{t("hytter.rediger_tittel")}</h2>

            <div>
                <label htmlFor="hytte-search">{t("hytter.søk_og_velg")}:</label>
                <input
                    type="text"
                    id="hytte-search"
                    list="hytter-rediger-list"
                    value={searchTerm}
                    maxLength={50}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        const matchedHytte = filteredHytter.find(
                            h => `ID: ${h.hytte_id} - ${h.navn}` === e.target.value ||
                                h.hytte_id?.toString() === e.target.value
                        );
                        if (matchedHytte) {
                            setSelectedId(matchedHytte.hytte_id.toString());
                        } else {
                            setSelectedId(null);
                        }
                    }}
                    placeholder={t("hytter.søk_placeholder")}
                />
                <datalist id="hytter-rediger-list">
                    {filteredHytter.map((hytte) => (
                        <option key={hytte.hytte_id} value={`ID: ${hytte.hytte_id} - ${hytte.navn}`} />
                    ))}
                </datalist>
            </div>

            {loading && <p>{t("hytter.laster_hyttedata")}</p>}

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
                        <label htmlFor="sengeplasser">{t("felles.antall_sengeplasser")}:</label>
                        <input
                            type="number"
                            id="sengeplasser"
                            value={sengeplasser}
                            onChange={(e) => setSengeplasser(e.target.value)}
                            min="1"
                            max="25"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="pris">{t("hytter.pris")}:</label>
                        <input
                            type="number"
                            id="pris"
                            value={pris}
                            onChange={(e) => setPris(e.target.value)}
                            min="0"
                            step="100"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="betjeningsgrad">{t("hytter.betjeningsgrad")}:</label>
                        <select
                            id="betjeningsgrad"
                            value={selectedBetjeningsgrad}
                            onChange={(e) => setSelectedBetjeningsgrad(e.target.value)}
                            required
                        >
                            <option value="" disabled hidden></option>
                            {betjeningsgrad.map((valg) => (
                                <option key={valg} value={valg}>{valg}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>{t("hytter.koordinater")}:</label>
                        <div>
                            <button type="button" onClick={open}>
                                {koordinat ? t("hytter.endre_koordinater") : t("hytter.velg_koordinater")}
                            </button>
                        </div>
                        {koordinat && (
                            <div style={{ marginTop: '10px' }}>
                                ✓ {t("hytter.koordinater_valgt")}: {koordinat[0].toFixed(5)}, {koordinat[1].toFixed(5)}
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
                            placeholder={t("hytter.fylke_automatisk")}
                        />
                    </div>

                    <div>
                        <label htmlFor="kommune">{t("felles.kommune")}:</label>
                        <input
                            type="text"
                            id="kommune"
                            value={kommune}
                            readOnly
                            placeholder={t("hytter.kommune_automatisk")}
                        />
                    </div>

                    <div>
                        <FasiliteterDropdown
                            overskrift={t("hytter.fasiliteter")}
                            alleValg={kategorier.fasilitet || []}
                            valgteFasiliteter={valgteFasiliteter}
                            onToggle={handleToggleFasilitet}
                        />
                    </div>

                    <div>
                        <label htmlFor="beskrivelse">{t("hytter.beskrivelse")}:</label>
                        <input
                            type="text"
                            id="beskrivelse"
                            value={beskrivelse}
                            onChange={(e) => setBeskrivelse(e.target.value)}
                            pattern="^[0-9A-Za-zØÆÅøæå\s]{3,150}$"
                            required
                        />
                    </div>

                    <div>
                        <label>{t("hytter.last_opp_bilde")}:</label>
                        <simple-file-upload
                            accept="image/*"
                            max-file-size="5242880"
                            max-files="5"
                            ref={uploaderRef}
                            public-key={import.meta.env.VITE_SFU_PUBLIC_KEY}
                        ></simple-file-upload>
                        {bildeUrl.length > 0 && (
                            <div style={{ marginTop: '10px' }}>
                                <p>{t("hytter.bilde_lastet_opp")} ({bildeUrl.length})</p>
                                {bildeUrl.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url.includes("simplefileupload") ? `${url}?w=200&h=200&fit=fit` : url}
                                        alt={`Preview ${index + 1}`}
                                        style={{ marginRight: '10px', maxWidth: '200px', maxHeight: '200px' }}
                                    />
                                ))}
                            </div>
                        )}
                        <TempBilde tempUrl={tempUrl} setTempUrl={setTempUrl} onLeggTil={handleLeggTilBilde} />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? t("hytter.oppdaterer") : t("hytter.oppdater_knapp")}
                    </button>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            )}

            <Modal show={isOpen} onClose={close} size="lg">
                <div className="modal-map-container">
                    <NyttKoordinat onLagreKoordinat={handleLagreKoordinat} />
                </div>
            </Modal>
        </div>
    );
}