import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useEnums } from "../../../hooks/useEnums";
import { useKategorier } from "../../../hooks/useKategorier";
import { useFileUpload } from "../../../hooks/useFileUpload";
import { useModal } from "../../../hooks/useModal";
import { hentKommuneData, hentFullHøydeData } from "../../../utils/geoUtils";
import { erGyldigKoordinatEttPunkt } from "../../../utils/erGyldigKoordinat";
import FasiliteterDropdown from "../../informasjon/FasiliteterDropdown";
import Modal from "../../../modal/Modal";
import NyttKoordinat from "../../NyttKoordinat";
import TempBilde from "../../TempBilde";

// Delt skjema for LeggTilHytte og RedigerHytte. Laget av Olai.
export default function HytteForm({ lagretData = {}, onSubmitAction, buttonTekst }) {
    const { t } = useTranslation();
    const { enumData: betjeningsgradValg } = useEnums("betjeningsgrad_enum");
    const { kategorier } = useKategorier();
    const { isOpen, open, close } = useModal();
    const uploaderRef = useRef(null);

    const [navn, setNavn] = useState(lagretData.navn || "");
    const [beskrivelse, setBeskrivelse] = useState(lagretData.beskrivelse || "");
    const [sengeplasser, setSengeplasser] = useState(lagretData.sengeplasser || 0);
    const [pris, setPris] = useState(lagretData.pris ?? "");
    const [selectedBetjeningsgrad, setSelectedBetjeningsgrad] = useState(lagretData.betjeningsgrad || "");
    const [valgteFasiliteter, setValgteFasiliteter] = useState(lagretData.fasiliteter || []);
    const [bildeUrl, setBildeUrl] = useState(lagretData.bilder || []);
    const [tempUrl, setTempUrl] = useState("");
    const [koordinat, setKoordinat] = useState(lagretData.koordinat || null);
    const [fylke, setFylke] = useState(lagretData.fylke || "");
    const [fylkeId, setFylkeId] = useState(lagretData.fylkeId || "");
    const [kommune, setKommune] = useState(lagretData.kommune || "");
    const [kommuneId, setKommuneId] = useState(lagretData.kommuneId || "");
    const [høydeData, setHøydeData] = useState(
        lagretData.moh != null ? { z: lagretData.moh } : null
    );

    useFileUpload(setBildeUrl);

    const handleToggleFasilitet = (fasilitet) => {
        setValgteFasiliteter(prev =>
            prev.some((f) => f.id === fasilitet.id)
                ? prev.filter((f) => f.id !== fasilitet.id)
                : [...prev, fasilitet]
        );
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!navn.trim() || !sengeplasser || sengeplasser < 1 || sengeplasser > 25 || !beskrivelse.trim() || !selectedBetjeningsgrad || !koordinat || Number(pris) < 0) {
            alert(t("hytter.fyll_ut_felt"));
            return;
        }

        onSubmitAction({
            navn,
            beskrivelse,
            sengeplasser: parseInt(sengeplasser),
            pris: parseFloat(pris),
            betjeningsgrad: selectedBetjeningsgrad,
            koordinat,
            moh: høydeData ? Math.round(høydeData.z) : 0,
            fylke,
            fylkeId,
            kommune,
            kommuneId,
            fasiliteter: valgteFasiliteter,
            bilder: bildeUrl,
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="hytte-navn">{t("felles.navn")}:</label>
                    <input
                        type="text"
                        id="hytte-navn"
                        value={navn}
                        onChange={(e) => setNavn(e.target.value)}
                        pattern="^[A-Za-zØÆÅøæå\s]{3,20}$"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="hytte-sengeplasser">{t("felles.antall_sengeplasser")}:</label>
                    <input
                        type="number"
                        id="hytte-sengeplasser"
                        value={sengeplasser}
                        onChange={(e) => setSengeplasser(e.target.value)}
                        min="1"
                        max="25"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="hytte-pris">{t("hytter.pris")}:</label>
                    <input
                        type="number"
                        id="hytte-pris"
                        value={pris}
                        onChange={(e) => setPris(e.target.value)}
                        min="0"
                        step="100"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="hytte-betjeningsgrad">{t("hytter.betjeningsgrad")}:</label>
                    <select
                        id="hytte-betjeningsgrad"
                        value={selectedBetjeningsgrad}
                        onChange={(e) => setSelectedBetjeningsgrad(e.target.value)}
                        required
                    >
                        <option value="" disabled hidden></option>
                        {betjeningsgradValg.map((valg) => (
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
                    <label htmlFor="hytte-fylke">{t("felles.fylke")}:</label>
                    <input
                        type="text"
                        id="hytte-fylke"
                        value={fylke}
                        readOnly
                        placeholder={t("hytter.fylke_automatisk")}
                    />
                </div>
                <div>
                    <label htmlFor="hytte-kommune">{t("felles.kommune")}:</label>
                    <input
                        type="text"
                        id="hytte-kommune"
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
                <div className="input-container">
                    <label className="input">{t("fellestur_form.beskrivelse")}
                        <textarea
                            style={{ resize: 'none', width: '100%', maxWidth: '400px' }}
                            rows="5" minLength="20" maxLength="1000"
                            value={beskrivelse}
                            onChange={(e) => setBeskrivelse(e.target.value)}
                            required
                        />
                        <small style={{ color: beskrivelse.length > 950 ? 'red' : '#666' }}>
                            {beskrivelse.length} / 1000
                        </small>
                    </label>
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
                <button type="submit">
                    {buttonTekst}
                </button>
            </form>

            <Modal show={isOpen} onClose={close} size="lg">
                <div className="modal-map-container">
                    <NyttKoordinat onLagreKoordinat={handleLagreKoordinat} />
                </div>
            </Modal>
        </>
    );
}
