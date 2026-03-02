import { useState } from "react";
import { useTurmål } from "../../../hooks/useTurmål";
import { useModal } from "../../../hooks/useModal";
import TurmålSøk from "../TurmålSøk";
import { toast } from 'react-toastify';
import ConfirmModal from "../../ConfirmModal";
import "../turmål-form/TurmålForm.css";

//Sletter Turmål med valgt ID. Laget av Kay.
export default function SlettTurmål() {
    const { isOpen, open, close } = useModal();
    const { turmål, deleteTurmål} = useTurmål({autoFetch: true});
    const [valgtId, setValgtId] = useState(0);
    const [valgtTittel, setValgtTittel] = useState("");

    const handleSelect = (id, tittel) => {
        setValgtId(id);
        setValgtTittel(tittel);
    };

    const handleSlett = async () => {
        if (valgtId === 0) {
            return toast.warn("Vennligst velg ett turmål først");
        }

        try {
            await deleteTurmål(valgtId);
            toast.success(`"${valgtTittel}" ble slettet`);
            setValgtId(0);
            setValgtTittel("");

        } catch (err) {
            toast.error("Kunne ikke slette turmålet: " + err.message);
        }
    };


    return (
        <div className="turmål-forum-container">
            <h2>Slett Turmål</h2>

            {/*Søkefelt til turmål*/}
            <TurmålSøk 
                turmål={turmål} 
                onSelect={handleSelect} 
                lagretTittel={valgtTittel}
            />
            
            <div className="input-container">
                <button 
                    onClick={open}
                    className="lagre-btn" 
                    disabled={false /*valgtId === 0  */} 
                >
                    Slett Turmål
                </button>
            </div>

            {/*Modal til å bekrefte sletting*/}
            <ConfirmModal 
                show={isOpen} 
                onClose={close} 
                onConfirm={handleSlett}
                tittel="Slett turmål"
                melding={`Er du helt sikker på at du vil slette "${valgtTittel}"?`}
                confirmText="Slett turmål"
            />
        </div>
    );
}