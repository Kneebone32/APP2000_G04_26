import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "../hooks/useModal";
import { useFileUpload } from "../hooks/useFileUpload";
import Modal from "../modal/Modal";
import Nytur from "./Nytur";
import { GpxParser } from "./GpxParser";

export default function LeggTilTur({ onSuccess }) {
    const { t } = useTranslation();
    const { isOpen, open, close } = useModal();
    const [navn, setNavn] = useState("");
    const [vanskelighetsgrad, setVanskelighetsgrad] = useState("Enkel");
    const [bildeUrl, setBildeUrl] = useState("");
    const [rutePunkter, setRutePunkter] = useState([]);
    const [lagredeKoordinater, setLagredeKoordinater] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const uploaderRef = useRef(null);

    useFileUpload(setBildeUrl);

    // Sjekker at koordinatene er innenfor Norge 57.5°N til 71°N, og 4°E til 31°E, ikke en perfekt løsning, 
    // kan sette turer midt i havet
    const erGyldigKoordinat = (koord) => {
        if (!koord || koord.length !== 2) return false;
        const [lat, lng] = koord;
        return lat >= 57.5 && lat <= 71 && lng >= 4 && lng <= 31;
    };

    const handleLagreKoordinater = (koords) => {
        if (koords && koords.length >= 2) {
            const startKoord = koords[0];
            const sluttKoord = koords[koords.length - 1];
            
            if (erGyldigKoordinat(startKoord) && erGyldigKoordinat(sluttKoord)) {
                setLagredeKoordinater(koords);
                close();
            } else {
                alert(t("tur.koordinater_utenfor_norge"));
            }
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

        if (!navn.trim() || !vanskelighetsgrad || vanskelighetsgrad < 1 || vanskelighetsgrad > 3) {
            alert(t("tur.fyll_ut_felt"));
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const startKoord = lagredeKoordinater && lagredeKoordinater.length >= 2 ? lagredeKoordinater[0] : null;
            const sluttKoord = lagredeKoordinater && lagredeKoordinater.length >= 2 ? lagredeKoordinater[lagredeKoordinater.length - 1] : null;

            const response = await fetch(`${import.meta.env.VITE_API_URL}/turer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    navn: navn,
                    vanskelighetsgrad: parseInt(vanskelighetsgrad),
                    turbilde_url: bildeUrl || null,
                    start_latitude: startKoord ? startKoord[0] : null,
                    start_longitude: startKoord ? startKoord[1] : null,
                    slutt_latitude: sluttKoord ? sluttKoord[0] : null,
                    slutt_longitude: sluttKoord ? sluttKoord[1] : null
                })
            });

        if (!response.ok) {
            throw new Error(`${t("tur.feil_opprettelse")}: ${response.status}`);
        }

        alert(t("tur.tur_lagt_til"));
        setNavn("");
        setVanskelighetsgrad(0);
        setBildeUrl("");
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
                        value={vanskelighetsgrad}
                        onChange={(e) => setVanskelighetsgrad(e.target.value)}
                        required
                    >
                        <option value="1">{t("tur.vanskelighetsgrad_1")}</option>
                        <option value="2">{t("tur.vanskelighetsgrad_2")}</option>
                        <option value="3">{t("tur.vanskelighetsgrad_3")}</option>
                    </select>
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
                    {bildeUrl && (
                        <div style={{ marginTop: '10px' }}>
                            <p>{t("tur.bilde_lastet_opp")}</p>
                            <img 
                                src={`${bildeUrl}?w=200&h=200&fit=fit`} 
                                alt="Preview" 
                            />
                        </div>
                    )}
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