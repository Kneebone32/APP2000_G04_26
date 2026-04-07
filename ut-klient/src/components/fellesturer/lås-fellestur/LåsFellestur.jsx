import { useState } from "react";
import { useFellestur } from "../../../hooks/useFellesturer";
import { useModal } from "../../../hooks/useModal";
import FellesturSøk from "../FellesturSøk";
import ConfirmModal from "../../ConfirmModal";
import { toast } from 'react-toastify';
import '../lås-dato/LåsDato.css';

//Låser en fellestur. Laget av Kay
//fellesturer-prop brukes av turleder for å begrense søk til egne turer
export default function LåsFellestur({fellesturer: fellesturer_prop} = {}) {
    const { fellesturer: fellesturer_alle, hentFellesturFraId, låsFellestur } = useFellestur({ autoFetch: !fellesturer_prop });
    const [valgtData, setValgtData] = useState(null);
    const [lasterFellestur, setLasterFellestur] = useState(false);
    const [laster, setLaster] = useState(false);
    const { isOpen: visBekreft, open: åpneBekreft, close: lukkBekreft } = useModal();
    const fellesturer = fellesturer_prop ?? fellesturer_alle;

    const handleSøkSelect = async (id) => {
        if (!id) {
            setValgtData(null);
            return;
        }
        setLasterFellestur(true);
        try {
            const data = await hentFellesturFraId(id);
            setValgtData(data);
        } catch (err) {
            toast.error('Kunne ikke hente fellestur: ' + err.message);
            setValgtData(null);
        } finally {
            setLasterFellestur(false);
        }
    };

    const handleLåsFellestur = async () => {
        if (!valgtData) return;
        setLaster(true);
        try {
            await låsFellestur(valgtData.aktivitet_id);
            toast.success(`Fellestur låst: ${valgtData.aktivitet_tittel}`);
            setValgtData(null);
        } catch (err) {
            toast.error('Kunne ikke låse fellestur: ' + err.message);
        } finally {
            setLaster(false);
        }
    };

    return (
        <div className="fellestur-form-container">
            <h2>Lås fellestur</h2>

            <FellesturSøk
                fellesturer={fellesturer}
                onSelect={handleSøkSelect}
                lagretTittel={valgtData?.aktivitet_tittel ?? ""}
            />

            {!lasterFellestur && valgtData && (
                <>
                    <p><strong>Fellestur:</strong> {valgtData.aktivitet_tittel}</p>
                    <button
                        type="button"
                        onClick={åpneBekreft}
                        disabled={laster}
                    >
                        Lås fellestur
                    </button>
                </>
            )}

            {!lasterFellestur && !valgtData && (
                <p>Velg en fellestur for å låse den</p>
            )}

            <ConfirmModal
                show={visBekreft}
                onClose={lukkBekreft}
                onConfirm={() => { lukkBekreft(); handleLåsFellestur(); }}
                tittel="Lås fellestur"
                melding={`Er du sikker på at du vil låse "${valgtData?.aktivitet_tittel}"?`}
                confirmTekst="Lås fellestur"
                knappFarge="blå"
            />
        </div>
    );
}