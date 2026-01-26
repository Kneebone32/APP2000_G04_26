import { useState } from "react";
import { useFetchHytter } from "../hooks/useFetchHytter";

export default function SlettHytte() {
    const { hytter, deleteHytte } = useFetchHytter(true);
    const [selectedId, setSelectedId] = useState(null);

    const handleSlettHytte = async () => {
        if (!selectedId) {
            alert("Velg en hytte for sletting.");
            return;
        }

        const selectedHytte = hytter.find(h => h.id === parseInt(selectedId)); 

        if (window.confirm(`Er du sikker på at du vil slette hytten: ${selectedHytte.navn}?`)) {
            try {
                await deleteHytte(selectedId);
                alert("Hytte er blitt slettet.");
                setSelectedId(null);
            } catch (err) {
                console.error('Error: ', err);
                alert("Noe gikk galt ved sletting av hytten.");
            }
        }
    };

    return (
        <div>
            <h2>Slett hytte</h2>
            <div>
                <label htmlFor="hytte-select">Velg hytte:</label>
                <select
                    id="hytte-select"
                    value={selectedId || ''}
                    onChange={(e) => setSelectedId(e.target.value)}
                >
                    <option value="">-- Velg en hytte --</option>
                    {hytter.map((hytte) => (
                        <option key={hytte.hytteid} value={hytte.hytteid}>
                            {hytte.navn}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleSlettHytte} disabled={!selectedId}>
                Slett hytte
            </button>
        </div>
    );
};