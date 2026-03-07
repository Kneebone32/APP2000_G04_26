import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "../../hooks/useModal";
import { useEnums } from "../../hooks/useEnums";
import { useFileUpload } from "../../hooks/useFileUpload";
import { useKategorier } from "../../hooks/useKategorier";
import FasiliteterDropdown from "../informasjon/FasiliteterDropdown";
import { hentKommuneData, hentFullHøydeData } from "../../utils/geoUtils";
import Modal from "../../modal/Modal";
import NyttKoordinat from "../NyttKoordinat";
import TempBilde from "../TempBilde";

import { erGyldigKoordinatEttPunkt } from "../../utils/erGyldigKoordinat";

export default function LeggTilHytte({ onSuccess }) {
    const { t } = useTranslation();
    const { isOpen, open, close } = useModal();
    const { enumData: betjeningsgrad, loadingEnum, enumError } = useEnums("betjeningsgrad_enum");
    const { kategorier } = useKategorier();
    const [navn, setNavn] = useState("");
    const [beskrivelse, setBeskrivelse] = useState("");
    const [sengeplasser, setSengeplasser] = useState(0);
    const [pris, setPris] = useState("");
    const [bildeUrl, setBildeUrl] = useState([]);
    const [tempUrl, setTempUrl] = useState("");
    const [koordinat, setKoordinat] = useState(null);
    const [breddegrad, setBreddegrad] = useState("");
    const [lengdegrad, setLengdegrad] = useState("");
    const [fylke, setFylke] = useState("");
    const [fylkeId, setFylkeId] = useState("");
    const [kommune, setKommune] = useState("");
    const [kommuneId, setKommuneId] = useState("");
    const [selectedBetjeningsgrad, setSelectedBetjeningsgrad] = useState("");
    const [valgteFasiliteter, setValgteFasiliteter] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [høydeData, setHøydeData] = useState([]);
    const [kommuneData, setKommuneData] = useState([]);
    const uploaderRef = useRef(null);

    useFileUpload(setBildeUrl);

    const handleToggleFasilitet = (navn) => {
        setValgteFasiliteter(prev =>
            prev.includes(navn) ? prev.filter(f => f !== navn) : [...prev, navn]
        );
    };

    //temp løsning for å legge til bilde via url, kun for testing laget av Kay
    const handleLeggTilBilde = (e) => {
        e.preventDefault();
        if (tempUrl.trim() !== "") {
            setBildeUrl([...bildeUrl, tempUrl]);
            setTempUrl("");
        }
    };

    const handleLagreKoordinat = async (koord) => {
        const lokalHøydeData = await hentFullHøydeData(koord[0], koord[1]);
        const lokalKommuneData = await hentKommuneData(koord[0], koord[1]);
        setHøydeData(lokalHøydeData);
        setKommuneData(lokalKommuneData);

        if (lokalKommuneData) {
            setFylke(lokalKommuneData.fylkesnavn || "");
            setFylkeId(lokalKommuneData.fylkesnummer || "");
            setKommune(lokalKommuneData.kommunenavn || "");
            setKommuneId(lokalKommuneData.kommunenummer || "");
        }

        if (erGyldigKoordinatEttPunkt(lokalHøydeData, "hytte")) {
            setKoordinat(koord);
            setBreddegrad(koord[0]);
            setLengdegrad(koord[1]);
            close();
        } else {
            alert(`Terrengtypen til koordinatene er ${lokalHøydeData.terreng}. Vennligst velg gyldige koordinater`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!navn.trim() || !sengeplasser || sengeplasser < 1 || sengeplasser > 25 || !beskrivelse.trim() || !selectedBetjeningsgrad || !koordinat || Number(pris) < 0) {
            alert(t("hytter.fyll_ut_felt"));
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hytte_navn: navn,
                    hytte_beskrivelse: beskrivelse,
                    hytte_sengeplasser: parseInt(sengeplasser),
                    hytte_pris: parseFloat(pris),
                    fylke_nummer: fylkeId,
                    kommune_nummer: kommuneId,
                    hytte_breddegrad: koordinat ? koordinat[0] : null,
                    hytte_lengdegrad: koordinat ? koordinat[1] : null,
                    hytte_moh: Math.round(høydeData.z) || 0,
                    hytte_betjeningsgrad: selectedBetjeningsgrad,
                    info_tab: valgteFasiliteter.length > 0 ? valgteFasiliteter : null,
                    bilder: bildeUrl.length > 0 ? bildeUrl : null
                })
            });

        if (!response.ok) {
            throw new Error(`${t("hytter.feil_opprettelse")}: ${response.status}`);
        }

        alert(t("hytter.lagt_til"));
        setNavn("");
        setBeskrivelse("");
        setSengeplasser(0);
        setPris(0);
        setBildeUrl([]);
        setKoordinat(null);
        setBreddegrad("");
        setLengdegrad("");
        setFylke("");
        setFylkeId("");
        setKommune("");
        setKommuneId("");
        setValgteFasiliteter([]);

        if (onSuccess) {
            onSuccess();
        }
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
                        <option value="" disabled selected hidden></option>
                        {betjeningsgrad.map((valg) => (
                            <option key={valg} value={valg}>
                                {valg}
                            </option>
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
                        onChange={(e) => setFylke(e.target.value)}
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
                        onChange={(e) => setKommune(e.target.value)}
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
                    {/* temp løsning for å legge til bilde via url, kun for testing laget av Kay*/}
                    <TempBilde tempUrl={tempUrl} setTempUrl={setTempUrl} onLeggTil={handleLeggTilBilde} />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? t("hytter.legger_til") : t("hytter.legg_til_knapp")}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
                
            <Modal show={isOpen} onClose={close} size="lg">
                <div className="modal-map-container">
                    <NyttKoordinat onLagreKoordinat={handleLagreKoordinat} />
                </div>
            </Modal>
        </div>
    );
}