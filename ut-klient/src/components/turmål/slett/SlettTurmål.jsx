import { useState } from "react";
import { useTurmål } from "../../../hooks/useTurmål";
import { useModal } from "../../../hooks/useModal";
import TurmålSøk from "../TurmålSøk";
import { toast } from 'react-toastify';
import ConfirmModal from "../../ConfirmModal";
import { useTranslation } from "react-i18next";
import "../turmål-form/TurmålForm.css";

//Sletter Turmål med valgt ID. Laget av Kay.
export default function SlettTurmål() {
    const { t } = useTranslation();
    const { isOpen, open, close } = useModal();
    const { turmål, slettTurmål} = useTurmål({autoFetch: true});
    const [valgtId, setValgtId] = useState(0);
    const [valgtTittel, setValgtTittel] = useState("");

    const handleSelect = (id, tittel) => {
        setValgtId(id);
        setValgtTittel(tittel);
    };

    const handleSlett = async () => {
        if (valgtId === 0) {
            return toast.warn(t("turmål.velg_for_sletting"));
        }

        try {
            await slettTurmål(valgtId);
            toast.success(`"${valgtTittel}${t("turmål.slettet")}`);
            setValgtId(0);
            setValgtTittel("");
            close();

        } catch (err) {
            toast.error(t("turmål.feil_sletting") + err.message);
        }
    };


    return (
        <div className="turmål-forum-container">
            <h2>{t("turmål.slett")}</h2>

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
                    {t("turmål.slett")}
                </button>
            </div>

            {/*Modal til å bekrefte sletting*/}
            <ConfirmModal 
                show={isOpen} 
                onClose={close} 
                onConfirm={handleSlett}
                tittel={t("turmål.slett").toLowerCase()}
                melding={`${t("turmål.bekreft_sletting")}${valgtTittel}"?`}
                confirmText={t("turmål.slett").toLowerCase()}
            />
        </div>
    );
}