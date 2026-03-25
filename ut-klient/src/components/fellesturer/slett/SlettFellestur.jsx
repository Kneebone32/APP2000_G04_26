import { useState } from "react";
import { useFellestur } from "../../../hooks/useFellesturer";
import { useModal } from "../../../hooks/useModal";
import FellesturSøk from "../FellesturSøk";
import { toast } from 'react-toastify';
import ConfirmModal from "../../ConfirmModal";
import { useTranslation } from "react-i18next";
import "../fellestur-form/FellesturForm.css";

//Sletter Fellestur med valgt ID. Laget av Kay
export default function SlettFellestur() {
    const { t } = useTranslation();
    const { isOpen, open, close } = useModal();
    const { fellesturer: fellestur, slettFellestur: deleteFellestur} = useFellestur({autoFetch: true});
    const [valgtId, setValgtId] = useState(0);
    const [valgtTittel, setValgtTittel] = useState("");

    const handleSelect = (id, tittel) => {
        setValgtId(id);
        setValgtTittel(tittel);
    };

    const handleSlett = async () => {
        if (valgtId === 0) {
            return toast.warn(t("fellesturer.velg_for_sletting"));
        }

        try {
            await deleteFellestur(valgtId);
            toast.success(`"${valgtTittel}${t("fellesturer.slettet")}`);
            setValgtId(0);
            setValgtTittel("");

        } catch (err) {
            toast.error(t("fellesturer.feil_sletting") + err.message);
        }
    };


    return (
        <div className="fellestur-forum-container">
            <h2>{t("fellesturer.slett")}</h2>

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
                    {t("fellesturer.slett")}
                </button>
            </div>

            {/*Modal til å bekrefte sletting*/}
            <ConfirmModal 
                show={isOpen} 
                onClose={close} 
                onConfirm={handleSlett}
                tittel={t("fellesturer.slett").toLowerCase()}
                melding={`${t("fellesturer.bekreft_sletting")}${valgtTittel}"?`}
                confirmText={t("fellesturer.slett_tur")}
            />
        </div>
    );
}