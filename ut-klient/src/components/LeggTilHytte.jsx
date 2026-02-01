import { useState } from "react";

export default function LeggTilHytte() {
    const [navn, setNavn] = useState("");
    const [sengeplasser, setSengeplasser] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                    sengeplasser: parseInt(sengeplasser)
                })
            });

        if (!response.ok) {
            throw new Error(`Feil med opprettelse: ${response.status}`);
        }

        alert("Hytte er blitt lagt til.");
        setNavn("");
        setSengeplasser(0);
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Legger til...' : 'Legg til hytte'}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
        </div>
    );
}