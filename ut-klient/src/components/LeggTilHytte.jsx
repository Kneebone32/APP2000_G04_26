import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function LeggTilHytte({ onSuccess }) {
    const { t } = useTranslation();
    const [navn, setNavn] = useState("");
    const [sengeplasser, setSengeplasser] = useState(0);
    const [bildeUrl, setBildeUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const uploaderRef = useRef(null);

    useEffect(() => {
        const uploader = document.querySelector('simple-file-upload');
        if (uploader) {
            const handleUpload = (event) => {
                const files = event.detail.allFiles;
                if (files && files.length > 0) {
                    const uploadedUrl = files[0].cdnUrl || files[0].url;
                    setBildeUrl(uploadedUrl);
                }
            };
            uploader.addEventListener('change', handleUpload);
            return () => uploader.removeEventListener('change', handleUpload);
        }
    }, []);

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
                    hyttebilde_url: bildeUrl || null
                })
            });

        if (!response.ok) {
            throw new Error(`${t("admin.feil_opprettelse")}: ${response.status}`);
        }

        alert(t("admin.hytte_lagt_til"));
        setNavn("");
        setSengeplasser(0);
        setBildeUrl("");

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
                <button type="submit" disabled={loading}>
                    {loading ? t("admin.legger_til") : t("admin.legg_til_knapp")}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
        </div>
    );
}