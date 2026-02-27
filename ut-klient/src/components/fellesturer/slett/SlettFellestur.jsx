import { useState } from "react";
import { useFellestur } from "../../../hooks/useFellesturer";
import { useModal } from "../../../hooks/useModal";
import FellesturSøk from "../FellesturSøk";
import { toast } from 'react-toastify';
import ConfirmModal from "../../ConfirmModal";
import "../fellestur-form/FellesturForm.css";

export default function SlettFellestur() {
    const { isOpen, open, close } = useModal();
    const { fellestur, deleteFellestur} = useFellestur();
    const [valgtId, setValgtId] = useState(0);
    const [valgtTittel, setValgtTittel] = useState("");

    const handleSelect = (id, tittel) => {
        setValgtId(id);
        setValgtTittel(tittel);
    };

    const handleSlett = async () => {
        if (valgtId === 0) {
            return toast.warn("Vennligst velg en fellestur først");
        }

        try {
            await deleteFellestur(valgtId);
            toast.success(`"${valgtTittel}" ble slettet`);
            setValgtId(0);
            setValgtTittel("");

        } catch (err) {
            toast.error("Kunne ikke slette turen: " + err.message);
        }
    };


    return (
        <div className="fellestur-forum-container">
            <h2>Slett Fellestur</h2>

            {/*Søkefelt til fellestur*/}
            <FellesturSøk 
                fellesturer={fellestur} 
                onSelect={handleSelect} 
                lagretTittel={valgtTittel}
            />
            
            <div className="input-container">
                <button 
                    onClick={open}
                    className="lagre-btn" 
                    disabled={false /*valgtId === 0  */} 
                >
                    Slett Fellestur
                </button>
            </div>

            {/*Modal til å bekrefte sletting*/}
            <ConfirmModal 
                show={isOpen} 
                onClose={close} 
                onConfirm={handleSlett}
                tittel="Slett fellestur"
                melding={`Er du helt sikker på at du vil slette "${valgtTittel}"?`}
                confirmText="Slett tur"
            />
        </div>
    );
}