import Modal from "../modal/Modal";
import "./ConfirmModal.css";

//Dynamisk beskreftelsesModal. Laget av Kay
export default function ConfirmModal({ 
    show, 
    onClose, 
    onConfirm, 
    tittel = "Bekreft handling", 
    melding = "Er du sikker på at du vil fortsette?",
    confirmTekst = "Ja, utfør",
    knappFarge = "rød"
}) {
    const confirmFarge = knappFarge === "rød" ? "btn-confirm-rød" : "btn-confirm";

    return (
        <Modal show={show} onClose={onClose} title={tittel} size="sm">
            <div className="confirm-modal-content">
                <p>{melding}</p>
                
                <div className="modal-footer-actions">
                    <button className={`btn-modal ${confirmFarge}`} onClick={onConfirm}>
                        {confirmTekst}
                    </button>
                    <button className="btn-modal btn-avbryt" onClick={onClose}>
                        Avbryt
                    </button>
                </div>
            </div>
        </Modal>
    );
}