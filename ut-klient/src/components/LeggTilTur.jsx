import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "../hooks/useModal";
import { useEnums } from "../hooks/useEnums";
import { useFileUpload } from "../hooks/useFileUpload";
import { hentKommuneData } from "../utils/geoUtils";
import Modal from "../modal/Modal";
import Nytur from "./Nytur";
import { GpxParser } from "./GpxParser";

export default function LeggTilTur({ onSuccess }) {
    const { t } = useTranslation();
    const { isOpen, open, close } = useModal();
    const { enumData: vanskelighetsgrad, loadingEnum, enumErrorVanskelighetsgrad } = useEnums("vanskelighetsgrad_enum");
    const { enumData: turtype, loadingTurtype, enumErrorTurtype } = useEnums("turtype_enum");
    const { enumData: varighet, loadingVarighet, enumErrorVarighet } = useEnums("varighet_enum");
    const [navn, setNavn] = useState("");
    const [selectedVanskelighetsgrad, setSelectedVanskelighetsgrad] = useState("");
    const [selectedTurtype, setSelectedTurtype] = useState("");
    const [selectedVarighet, setSelectedVarighet] = useState("");
    const [fylke, setFylke] = useState("");
    const [fylkeId, setFylkeId] = useState("");
    const [kommune, setKommune] = useState("");
    const [kommuneId, setKommuneId] = useState("");
    const [beskrivelse, setBeskrivelse] = useState("");
    const [bildeUrl, setBildeUrl] = useState([]);
    const [rutePunkter, setRutePunkter] = useState([]);
    const [lagredeKoordinater, setLagredeKoordinater] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const uploaderRef = useRef(null);

    useFileUpload(setBildeUrl);

    const handleLagreKoordinater = async (koords) => {
        if (koords && koords.length >= 2) {
            const startKoord = koords[0];
            const sluttKoord = koords[koords.length - 1];
            
            setLagredeKoordinater(koords);
            
            try {
                const kommuneData = await hentKommuneData(startKoord[0], startKoord[1]);
                if (kommuneData) {
                    setFylke(kommuneData.fylkesnavn || "");
                    setFylkeId(kommuneData.fylkesnummer || "");
                    setKommune(kommuneData.kommunenavn || "");
                    setKommuneId(kommuneData.kommunenummer || "");
                }
            } catch (error) {
                console.error("Feil ved henting av kommune/fylke:", error);
            }
            
            close();

        } else {
            alert(t("tur.velg_minst_to_punkter"));
        }
    };

        const handleGpxKoordinater = (koords) => {
        if (koords && koords.length >= 2) {
            const startKoord = koords[0];
            const sluttKoord = koords[koords.length - 1];
            
            if (erGyldigKoordinat(startKoord) && erGyldigKoordinat(sluttKoord)) {
                setLagredeKoordinater(koords);
                setRutePunkter(koords);
            } else {
                alert(t("tur.gpx_utenfor_norge"));
            }
        } else if (koords && koords.length === 1) {
            alert(t("tur.gpx_ett_punkt"));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!navn.trim() || !selectedVanskelighetsgrad || !selectedTurtype || !selectedVarighet || !lagredeKoordinater) {
            alert(t("tur.fyll_ut_felt"));
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const startKoord = lagredeKoordinater && lagredeKoordinater.length >= 2 ? lagredeKoordinater[0] : null;
            const sluttKoord = lagredeKoordinater && lagredeKoordinater.length >= 2 ? lagredeKoordinater[lagredeKoordinater.length - 1] : null;

            const response = await fetch(`${import.meta.env.VITE_API_URL}/turruter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    turrute_navn: navn,
                    beskrivelse: beskrivelse,
                    vanskelighetsgrad: selectedVanskelighetsgrad || null,
                    varighet: selectedVarighet || null,
                    turtype: selectedTurtype || null,
                    fylke_id: 4,
                    kommune_id: 2,
                    punkter: lagredeKoordinater || null,
                    info_array: null,
                    bilder: bildeUrl.length > 0 ? bildeUrl : null
                })
            });

        if (!response.ok) {
            throw new Error(`${t("tur.feil_opprettelse")}: ${response.status}`);
        }

        alert(t("tur.tur_lagt_til"));
        setNavn("");
        setSelectedVanskelighetsgrad("");
        setSelectedTurtype("");
        setSelectedVarighet("");
        setFylke("");
        setFylkeId("");
        setKommune("");
        setKommuneId("");
        setBeskrivelse("");
        setBildeUrl([]);
        setLagredeKoordinater(null);
        setRutePunkter([]);

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
            <h2>{t("tur.legg_til_tur")}</h2>
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
                            <option key={valg} value={valg}>
                                {valg}
                            </option>
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
                            <option key={valg} value={valg}>
                                {valg}
                            </option>
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
                            <option key={valg} value={valg}>
                                {valg}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="fylke">{t("felles.fylke")}:</label>
                    <input
                        type="text"
                        id="fylke"
                        value={fylke}
                        onChange={(e) => setFylke(e.target.value)}
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
                        onChange={(e) => setKommune(e.target.value)}
                        readOnly
                        placeholder={t("tur.kommune_automatisk")}
                    />
                </div>
                <div>
                    <label>{t("tur.koordinater_start_slutt")}:</label>
                    <div>
                        {!lagredeKoordinater && (
                            <GpxParser onKoordinaterLastet={handleGpxKoordinater} />
                        )}
                        <button type="button" onClick={open}>
                            {lagredeKoordinater ? t("tur.endre_rute") : t("tur.lag_rute")}
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
                    <label htmlFor="beskrivelse">{t("tur.beskrivelse")}:</label>
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
                <button type="submit" disabled={loading}>
                    {loading ? t("tur.legger_til") : t("tur.legg_til_knapp")}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>

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