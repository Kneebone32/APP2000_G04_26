import { useState } from "react";
import { useFetchHytter } from "../hooks/useFetchHytter";
import './Admin.css';

export default function Admin() {
    const { hytter, loading, refetch } = useFetchHytter(true);
    
    // State for legg til hytte
    const [hytteId, setHytteId] = useState("");
    const [navn, setNavn] = useState("");
    const [sengeplasser, setSengeplasser] = useState("");
    const [addLoading, setAddLoading] = useState(false);

    // State for slett hytte
    const [selectedId, setSelectedId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Legg til hytte funksjon
    const handleLeggTilHytte = async (e) => {
        e.preventDefault();

        if (!hytteId.trim() || !navn.trim() || !sengeplasser) {
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
                    hytteid: parseInt(hytteId),
                    navn: navn,
                    sengeplasser: parseInt(sengeplasser)
                })
            });

            if (!response.ok) {
                throw new Error(`Feil med opprettelse: ${response.status}`);
            }

            alert("Hytte er blitt lagt til.");
            setHytteId("");
            setNavn("");
            setSengeplasser("");
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

        const selectedHytte = hytter.find(h => h.hytteid === parseInt(selectedId));

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
        hytte.hytteid?.toString().includes(searchTerm) ||
        hytte.navn?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="AdminPanel">
            <h1>Admin Panel</h1>
            
            <div>
                <h2>Legg til ny hytte</h2>
                <form onSubmit={handleLeggTilHytte}>
                    <div>
                        <label htmlFor="hytteid">Hytte ID:</label>
                        <input
                            type="number"
                            id="hytteid"
                            value={hytteId}
                            onChange={(e) => setHytteId(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="navn">Navn:</label>
                        <input
                            type="text"
                            id="navn"
                            value={navn}
                            onChange={(e) => setNavn(e.target.value)}
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
                            required
                        />
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
                                `ID: ${h.hytteid} - ${h.navn}` === e.target.value ||
                                h.hytteid?.toString() === e.target.value
                            );
                            if (matchedHytte) {
                                setSelectedId(matchedHytte.hytteid.toString());
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

            <div>
                <h2>Alle hytter ({hytter.length})</h2>
                {loading ? (
                    <p>Laster...</p>
                ) : (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Navn</th>
                                <th>Sengeplasser</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hytter.map((hytte) => (
                                <tr key={hytte.hytte_id}>
                                    <td>{hytte.hytte_id}</td>
                                    <td>{hytte.navn}</td>
                                    <td>{hytte.sengeplasser}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
