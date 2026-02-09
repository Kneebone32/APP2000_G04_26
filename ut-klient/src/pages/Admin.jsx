import { useState, useEffect, useRef } from "react";
import { useFetchHytter } from "../hooks/useFetchHytter";
import './Admin.css';

export default function Admin() {
    const { hytter, loading, refetch } = useFetchHytter(true);
    
    // State for legg til hytte
    const [navn, setNavn] = useState("");
    const [sengeplasser, setSengeplasser] = useState("");
    const [bildeUrl, setBildeUrl] = useState("");
    const [addLoading, setAddLoading] = useState(false);
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

    // State for slett hytte
    const [selectedId, setSelectedId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Legg til hytte funksjon
    const handleLeggTilHytte = async (e) => {
        e.preventDefault();

        if (!navn.trim() || !sengeplasser) {
            alert("Vennligst fyll ut alle feltene.");
            return;
        }

        try {
            setAddLoading(true);

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
            setSengeplasser("");
            setBildeUrl("");
            refetch(); // Oppdater listen
        } catch (err) {
            console.error('Error: ', err);
            alert("Noe gikk galt ved opprettelse av hytten.");
        } finally {
            setAddLoading(false);
        }
    };

    // Slett hytte funksjon
    const handleSlettHytte = async () => {
        if (!selectedId) {
            alert("Velg en hytte for sletting.");
            return;
        }

        const selectedHytte = hytter.find(h => h.hytte_id === parseInt(selectedId));

        if (window.confirm(`Er du sikker på at du vil slette hytten: ${selectedHytte?.navn}?`)) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${selectedId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`Error ved sletting: ${response.status}`);
                }

                alert("Hytte er blitt slettet.");
                setSelectedId("");
                setSearchTerm("");
                refetch(); // Oppdater listen
            } catch (err) {
                console.error('Error: ', err);
                alert("Noe gikk galt ved sletting av hytten.");
            }
        }
    };

    // Filtrer hytter basert på søkeord
    const filteredHytter = hytter.filter(hytte => 
        hytte.hytte_id?.toString().includes(searchTerm) ||
        hytte.navn?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="AdminPanel">
            <h1>Admin Panel</h1>
            
            <div>
                <h2>Legg til ny hytte</h2>
                <form onSubmit={handleLeggTilHytte}>
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
                    <button type="submit" disabled={addLoading}>
                        {addLoading ? 'Legger til...' : 'Legg til hytte'}
                    </button>
                </form>
            </div>

            <hr />

            <div>
                <h2>Slett hytte</h2>
                <div>
                    <label htmlFor="hytte-search">Søk og velg hytte (ID eller navn):</label>
                    <input
                        type="text"
                        id="hytte-search"
                        list="hytter-list"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            // Finn hytte basert på input
                            const matchedHytte = hytter.find(h => 
                                `ID: ${h.hytte_id} - ${h.navn}` === e.target.value ||
                                h.hytte_id?.toString() === e.target.value
                            );
                            if (matchedHytte) {
                                setSelectedId(matchedHytte.hytte_id.toString());
                            } else {
                                setSelectedId("");
                            }
                        }}
                        placeholder="Søk etter hytte..."
                    />
                    <datalist id="hytter-list">
                        {filteredHytter.map((hytte) => (
                            <option key={hytte.hytte_id} value={`ID: ${hytte.hytte_id} - ${hytte.navn}`} />
                        ))}
                    </datalist>
                </div>
                <button onClick={handleSlettHytte} disabled={!selectedId}>
                    Slett hytte
                </button>
            </div>

            <hr />
        </div>
    );
}
