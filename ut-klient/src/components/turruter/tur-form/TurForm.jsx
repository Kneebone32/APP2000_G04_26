import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "../../../hooks/useModal";
import { useEnums } from "../../../hooks/useEnums";
import { useFileUpload } from "../../../hooks/useFileUpload";
import { hentKommuneData, regnUtTotalLengde, byggPunkterMedMoh } from "../../../utils/geoUtils";
import Modal from "../../../modal/Modal";
import Nytur from "../../Nytur";
import { GpxParser } from "../../GpxParser";
import LeggTilHytterTurmål from "../../fellesturer/legg-til/LeggTilHytterTurmål";

// Delt skjema for LeggTilTur og RedigerTur. Laget av Olai.
export default function TurForm({ lagretData = {}, onSubmitAction, buttonTekst, editModus = false }) {
    const { t } = useTranslation();
    const { enumData: vanskelighetsgrad } = useEnums("vanskelighetsgrad_enum");
    const { enumData: turtype } = useEnums("turtype_enum");
    const { enumData: varighet } = useEnums("varighet_enum");
    const { isOpen, open, close } = useModal();
    const { isOpen: hytterÅpen, open: åpneHytter, close: lukkHytter } = useModal();
    const uploaderRef = useRef(null);

    const [navn, setNavn] = useState(lagretData.navn || "");
    const [selectedVanskelighetsgrad, setSelectedVanskelighetsgrad] = useState(lagretData.vanskelighetsgrad || "");
    const [selectedTurtype, setSelectedTurtype] = useState(lagretData.turtype || "");
    const [selectedVarighet, setSelectedVarighet] = useState(lagretData.varighet || "");
    const [fylke, setFylke] = useState(lagretData.fylke || "");
    const [fylkeId, setFylkeId] = useState(lagretData.fylkeId || "");
    const [kommune, setKommune] = useState(lagretData.kommune || "");
    const [kommuneId, setKommuneId] = useState(lagretData.kommuneId || "");
    const [beskrivelse, setBeskrivelse] = useState(lagretData.beskrivelse || "");
    const [bildeUrl, setBildeUrl] = useState(lagretData.bilder || []);
    const [rutePunkter, setRutePunkter] = useState(lagretData.rutePunkter || []);
    const [lagredeKoordinater, setLagredeKoordinater] = useState(lagretData.rutePunkter?.length >= 2 ? lagretData.rutePunkter : null);
    const [hytterITuren, setHytterITuren] = useState([]);
    const [turmålITuren, setTurmålITuren] = useState([]);
    const [stierITuren, setStierITuren] = useState([]);
    const [nyeStierITuren, setNyeStierITuren] = useState([]);
    const [gpxKoords, setGpxKoords] = useState([]);
    const [totalRuteLengde, setTotalRuteLengde] = useState(null);

    useFileUpload(setBildeUrl);

    const oppdaterKommuneData = async (koords) => {
        try {
            const kommuneData = await hentKommuneData(koords[0][0], koords[0][1]);
            if (kommuneData) {
                setFylke(kommuneData.fylkesnavn || "");
                setFylkeId(kommuneData.fylkesnummer || "");
                setKommune(kommuneData.kommunenavn || "");
                setKommuneId(kommuneData.kommunenummer || "");
            }
        } catch (error) {
            console.error("Feil ved henting av kommune/fylke:", error);
        }
    };

    const handleLagreKoordinater = async (koords) => {
        if (koords && koords.length >= 2) {
            setLagredeKoordinater(koords);
            setRutePunkter(koords);
            setTotalRuteLengde(regnUtTotalLengde(koords));
            await oppdaterKommuneData(koords);
            close();
        } else {
            alert(t("tur.velg_minst_to_punkter"));
        }
    };

    const handleGpxKoordinater = async (koords) => {
        if (koords && koords.length >= 2) {
            setLagredeKoordinater(koords);
            setRutePunkter(koords);
            setTotalRuteLengde(regnUtTotalLengde(koords));
            const punkter = await byggPunkterMedMoh(koords);
            setGpxKoords(punkter);
            await oppdaterKommuneData(koords);
        } else if (koords && koords.length === 1) {
            alert(t("tur.gpx_ett_punkt"));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!navn.trim() || !selectedVanskelighetsgrad || !selectedTurtype || !selectedVarighet || !lagredeKoordinater) {
            alert(t("tur.fyll_ut_felt"));
            return;
        }

        onSubmitAction({
            navn,
            vanskelighetsgrad: selectedVanskelighetsgrad,
            turtype: selectedTurtype,
            varighet: selectedVarighet,
            fylke,
            fylkeId,
            kommune,
            kommuneId,
            beskrivelse,
            bilder: bildeUrl,
            punkter: lagredeKoordinater,
            hytter: hytterITuren,
            turmaal: turmålITuren,
            stier: stierITuren,
            ruteLengde: totalRuteLengde
        });
    };

    return (
        <div>
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
                        <option value="" disabled selected hidden></option>
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
                        <option value="" disabled selected hidden></option>
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
                        <option value="" disabled selected hidden></option>
                        {varighet.map((valg) => (
                            <option key={valg} value={valg}>{valg}</option>
                        ))}
                    </select>
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
                    <label>{t("tur.koordinater_start_slutt")}:</label>
                    <div>
                        {!editModus && !lagredeKoordinater && (
                            <GpxParser onKoordinaterLastet={handleGpxKoordinater} />
                        )}
                        {!editModus && rutePunkter.length > 1 && gpxKoords.length > 1 && (
                            <button type="button" onClick={åpneHytter}>
                                Legg til Hytter eller Turmål
                            </button>
                        )}
                        <button type="button" onClick={open}>
                            {lagredeKoordinater ? t("tur.endre_rute") : t("tur.lag_rute")}
                        </button>
                    </div>
                    {lagredeKoordinater && lagredeKoordinater.length >= 2 && (
                        <div style={{ marginTop: '10px' }}>
                            <p>✓ {t("tur.rute_lagret")} {lagredeKoordinater.length} {t("tur.punkter")}</p>
                            <p>{t("tur.start")}: {parseFloat(lagredeKoordinater[0][0].toFixed(5))}, {parseFloat(lagredeKoordinater[0][1].toFixed(5))}</p>
                            <p>{t("tur.slutt")}: {parseFloat(lagredeKoordinater[lagredeKoordinater.length - 1][0]).toFixed(5)}, {parseFloat(lagredeKoordinater[lagredeKoordinater.length - 1][1]).toFixed(5)}</p>
                            {totalRuteLengde !== null && (
                                <p>{t("tur.rutelengde") || "Rutelengde"}: {totalRuteLengde.toFixed(3)} km</p>
                            )}
                        </div>
                    )}
                </div>
                <div className="input-container">
                    <label className="input">{t("tur.beskrivelse")}
                        <textarea
                            style={{ resize: 'none', width: '100%', maxWidth: '400px' }}
                            rows="5" minLength="20" maxLength="1000"
                            value={beskrivelse} onChange={(e) => setBeskrivelse(e.target.value)}
                            required
                        />
                        <small style={{ color: beskrivelse.length > 950 ? 'red' : '#666' }}>
                            {beskrivelse.length} / 1000
                        </small>
                    </label>
                </div>
                {!editModus && (
                    <div>
                        <label>{t("tur.last_opp_bilde")}:</label>
                        <simple-file-upload
                            accept="image/*"
                            max-file-size="5242880"
                            max-files="5"
                            ref={uploaderRef}
                            public-key={import.meta.env.VITE_SFU_PUBLIC_KEY}
                        ></simple-file-upload>
                        {bildeUrl.length > 0 && (
                            <div style={{ marginTop: '10px' }}>
                                <p>{t("tur.bilde_lastet_opp")} ({bildeUrl.length})</p>
                                {bildeUrl.map((url, index) => (
                                    <img
                                        key={index}
                                        src={`${url}?w=200&h=200&fit=fit`}
                                        alt={`Preview ${index + 1}`}
                                        style={{ marginRight: '10px' }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <button type="submit">
                    {buttonTekst}
                </button>
            </form>

            <Modal show={hytterÅpen} onClose={lukkHytter} size="lg">
                <div className="modal-map-container">
                    <LeggTilHytterTurmål
                        gpxKoords={gpxKoords}
                        hytterITuren={hytterITuren}
                        setHytterITuren={setHytterITuren}
                        turmålITuren={turmålITuren}
                        setTurmålITuren={setTurmålITuren}
                        onLagre={lukkHytter}
                    />
                </div>
            </Modal>

            <Modal show={isOpen} onClose={close} size="lg">
                <div className="modal-map-container">
                    <Nytur
                        rutePunkter={rutePunkter}
                        setRutePunkter={setRutePunkter}
                        onLagreKoordinater={handleLagreKoordinater}
                        hytterITuren={hytterITuren}
                        setHytterITuren={setHytterITuren}
                        turmålITuren={turmålITuren}
                        setTurmålITuren={setTurmålITuren}
                        stierITuren={stierITuren}
                        setStierITuren={setStierITuren}
                        nyeStier={nyeStierITuren}
                        setNyeStier={setNyeStierITuren}
                    />
                </div>
            </Modal>
        </div>
    );
}
