import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "../hooks/useModal";
import { useFileUpload } from "../hooks/useFileUpload";
import Modal from "../modal/Modal";
import NyttKoordinat from "./NyttKoordinat";
import { GpxParser } from "./GpxParser";

export default function LeggTilHytte({ onSuccess }) {
    const { t } = useTranslation();
    const { isOpen, open, close } = useModal();
    const [navn, setNavn] = useState("");
    const [sengeplasser, setSengeplasser] = useState(0);
    const [bildeUrl, setBildeUrl] = useState("");
    const [koordinat, setKoordinat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const uploaderRef = useRef(null);

    useFileUpload(setBildeUrl);

    // Sjekker at koordinatene er innenfor Norge 57.5°N til 71°N, og 4°E til 31°E, ikke en perfekt løsning, 
    // kan sette hytter midt i havet
    const erGyldigKoordinat = (koord) => {
        if (!koord || koord.length !== 2) return false;
        const [lat, lng] = koord;
        return lat >= 57.5 && lat <= 71 && lng >= 4 && lng <= 31;
    };

    const handleLagreKoordinat = (koord) => {
        if (erGyldigKoordinat(koord)) {
            setKoordinat(koord);
            close();
        } else {
            alert("Koordinatene er utenfor Norge. Vennligst velg koordinater innenfor Norge.");
        }
    };

    const handleGpxKoordinater = (koords) => {
        if (koords && koords.length > 0) {
            if (erGyldigKoordinat(koords[0])) {
                setKoordinat(koords[0]);
            } else {
                alert("Koordinatene fra GPX-filen er utenfor Norge. Vennligst velg koordinater innenfor Norge.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!navn.trim() || !sengeplasser || sengeplasser < 1 || sengeplasser > 25) {
            alert(t("admin.fyll_ut_felt"));
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
                    navn: navn,
                    sengeplasser: parseInt(sengeplasser),
                    hyttebilde_url: bildeUrl || null,
                    latitude: koordinat ? koordinat[0] : null,
                    longitude: koordinat ? koordinat[1] : null
                })
            });

        if (!response.ok) {
            throw new Error(`${t("admin.feil_opprettelse")}: ${response.status}`);
        }

        alert(t("admin.hytte_lagt_til"));
        setNavn("");
        setSengeplasser(0);
        setBildeUrl("");
        setKoordinat(null);

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
            <h2>{t("admin.legg_til_hytte")}</h2>
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
                    <label htmlFor="sengeplasser">{t("admin.antall_sengeplasser")}:</label>
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
                    <label>{t("admin.last_opp_bilde")}:</label>
                    <simple-file-upload
                        accept="image/*"
                        max-file-size="5242880"
                        max-files="5"
                        ref={uploaderRef}
                        public-key={import.meta.env.VITE_SFU_PUBLIC_KEY}
                    ></simple-file-upload>
                    {bildeUrl && (
                        <div style={{ marginTop: '10px' }}>
                            <p>{t("admin.bilde_lastet_opp")}</p>
                            <img 
                                src={`${bildeUrl}?w=200&h=200&fit=fit`} 
                                alt="Preview" 
                            />
                        </div>
                    )}
                </div>
                <div>
                    <label>Koordinater:</label>
                    <div>
                        {!koordinat && (
                            <GpxParser onKoordinaterLastet={handleGpxKoordinater} />
                        )}
                        <button type="button" onClick={open}>
                            {koordinat ? "Endre koordinater" : "Velg koordinater"}
                        </button>
                    </div>
                    {koordinat && (
                        <p style={{ marginTop: '10px' }}>
                            ✓ Koordinater valgt: {koordinat[0].toFixed(5)}, {koordinat[1].toFixed(5)}
                        </p>
                    )}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? t("admin.legger_til") : t("admin.legg_til_knapp")}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>

            <Modal show={isOpen} onClose={close} size="lg">
                <div style={{ width: '100%', height: '500px' }}>
                    <NyttKoordinat onLagreKoordinat={handleLagreKoordinat} />
                </div>
            </Modal>
        </div>
    );
}