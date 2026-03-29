import { useState } from "react";
import { useFetchAnnonser } from "../../hooks/useFetchAnnonser";

// Lar bruker søke opp en annonse og slette den etter bekreftelse. Laget av Olai.
export default function SlettAnnonse({ onSuccess }) {
    const { annonser, loadingAnnonser, slettAnnonse } = useFetchAnnonser({ autoFetch: true });
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Sletter valgt annonse hvis bruker bekrefter i dialogen.
    const handleSlettAnnonse = async () => {
        if (!selectedId) {
            alert("Velg en annonse først");
            return;
        }

        const selectedAnnonse = annonser.find(a => a.annonse_id === parseInt(selectedId));

        if (window.confirm(`Er du sikker på at du vil slette "${selectedAnnonse?.tittel}"?`)) {
            try {
                await slettAnnonse(selectedId);
                alert("Annonse slettet");
                setSelectedId(null);
                setSearchTerm("");

                if (onSuccess) onSuccess();
            } catch (err) {
                console.error("Error: ", err);
                alert("Kunne ikke slette annonsen");
            }
        }
    };

    // Filtrerer forslagene i datalisten basert på ID eller tittel.
    const filteredAnnonser = annonser.filter(a =>
        a.annonse_id?.toString().includes(searchTerm) ||
        a.tittel?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Slett annonse</h2>
            <div>
                <label htmlFor="annonse-slett-search">Søk og velg annonse:</label>
                <input
                    type="text"
                    id="annonse-slett-search"
                    list="annonser-slett-list"
                    value={searchTerm}
                    maxLength={50}
                    onChange={(e) => {
                        // Matcher fritekst mot datalist-verdi og setter valgt annonse-ID.
                        setSearchTerm(e.target.value);
                        const matchedAnnonse = annonser.find(a =>
                            `ID: ${a.annonse_id} - ${a.tittel}` === e.target.value ||
                            a.annonse_id?.toString() === e.target.value
                        );
                        if (matchedAnnonse) {
                            setSelectedId(matchedAnnonse.annonse_id.toString());
                        } else {
                            setSelectedId("");
                        }
                    }}
                    placeholder="Søk på tittel eller ID..."
                />
                <datalist id="annonser-slett-list">
                    {filteredAnnonser.map((a) => (
                        <option key={a.annonse_id} value={`ID: ${a.annonse_id} - ${a.tittel}`} />
                    ))}
                </datalist>
            </div>
            {loadingAnnonser && <p>Laster annonser...</p>}
            <button onClick={handleSlettAnnonse} disabled={!selectedId}>
                Slett annonse
            </button>
        </div>
    );
}
