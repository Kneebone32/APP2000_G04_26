import { useState } from "react";
import { toast } from "react-toastify";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useFetchAnnonser } from "../../hooks/useFetchAnnonser";
import { useModal } from "../../hooks/useModal";
import ConfirmModal from "../ConfirmModal";

// Lar bruker søke opp en annonse og slette den etter bekreftelse. Laget av Olai.
export default function SlettAnnonse({ onSuccess }) {
    const { token } = useAutentisering({ autoFetch: true });
    const { annonser, loadingAnnonser, slettAnnonse } = useFetchAnnonser({ autoFetch: true, token });
    const { isOpen, open, close } = useModal();
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const valgtAnnonse = annonser.find(a => a.annonse_id === parseInt(selectedId));

    const handleSlett = async () => {
        if (!selectedId) return;

        try {
            await slettAnnonse(selectedId);
            toast.success(`"${valgtAnnonse?.tittel}" ble slettet.`);
            close();
            setSelectedId(null);
            setSearchTerm("");

            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error("Kunne ikke slette annonsen: " + err.message);
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
                        setSelectedId(matchedAnnonse ? matchedAnnonse.annonse_id.toString() : null);
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

            <button onClick={open} disabled={!selectedId}>
                Slett annonse
            </button>

            <ConfirmModal
                show={isOpen}
                onClose={close}
                onConfirm={handleSlett}
                tittel="Slett annonse"
                melding={`Er du sikker på at du vil slette "${valgtAnnonse?.tittel}"?`}
                confirmTekst="Slett"
            />
        </div>
    );
}
