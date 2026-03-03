import Modal from "../modal/Modal";
import { useTranslation } from "react-i18next";
import "./ConfirmModal.css";

//Dynamisk beskreftelsesModal. Laget av Kay
export default function ConfirmModal({ 
    show, 
    onClose, 
    onConfirm, 
    tittel, 
    melding,
    confirmTekst,
    knappFarge = "rød"
}) {
    const { t } = useTranslation();
    const confirmFarge = knappFarge === "rød" ? "btn-confirm-rød" : "btn-confirm";

    return (
        <Modal show={show} onClose={onClose} title={tittel || t("bekreft_modal.tittel")} size="sm">
            <div className="confirm-modal-content">
                <p>{melding || t("bekreft_modal.melding")}</p>
                
                <div className="modal-footer-actions">
                    <button className={`btn-modal ${confirmFarge}`} onClick={onConfirm}>
                        {confirmTekst || t("bekreft_modal.bekreft")}
                    </button>
                    <button className="btn-modal btn-avbryt" onClick={onClose}>
                        {t("bekreft_modal.avbryt")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}