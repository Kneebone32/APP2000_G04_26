import { useState, useEffect, useRef } from "react";

export default function LeggTilHytte() {
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
            alert("Vennligst fyll ut alle feltene.");
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
            throw new Error(`Feil med opprettelse: ${response.status}`);
        }

        alert("Hytte er blitt lagt til.");
        setNavn("");
        setSengeplasser(0);
        setBildeUrl("");
    } catch (err) {
        console.error('Error: ', err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

    return (
        <div>
            <h2>Legg til ny hytte</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="navn">Navn:</label>
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
                    <label htmlFor="sengeplasser">Sengeplasser:</label>
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
                    <label>Last opp bilde:</label>
                    <simple-file-upload
                        accept="image/*"
                        max-file-size="5242880"
                        max-files="5"
                        ref={uploaderRef}
                        public-key={import.meta.env.VITE_SFU_PUBLIC_KEY}
                    ></simple-file-upload>
                    {bildeUrl && (
                        <div style={{ marginTop: '10px' }}>
                            <p>Bilde lastet opp!</p>
                            <img 
                                src={`${bildeUrl}?w=200&h=200&fit=fit`} 
                                alt="Preview" 
                            />
                        </div>
                    )}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Legger til...' : 'Legg til hytte'}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
        </div>
    );
}