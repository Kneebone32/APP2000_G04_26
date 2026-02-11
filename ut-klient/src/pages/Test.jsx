import PageWrapper from "../components/PageWrapper";
import { useModal } from "../hooks/useModal";
import Modal from "../modal/Modal";
import Nytur from "../components/Nytur";
import { useState } from "react";
import "./Test.css";
import { GpxParser } from "../components/GpxParser";

export default function Test() {
    const {isOpen, open, close} = useModal();
    const [rutePunkter, setRutePunkter] = useState([]);
    const [lagredeKoordinater, setLagredeKoordinater] = useState(null);
    const [lagret, setLagret] = useState(false);

    const handleLagreKoordinater = (koords) => {
        setLagredeKoordinater(koords);
        setLagret(true);
        close();
        console.log(rutePunkter);
    };

    const handleGpxKoordinater = (koords) => {
        setLagredeKoordinater(koords);
        setRutePunkter(koords);
        setLagret(true);
    };

    return (
        <PageWrapper>
            <div className="kart-knapp-container">
                <div>
                {!lagret && (
                    <GpxParser onKoordinaterLastet={handleGpxKoordinater} />
                )}
                </div>
                <button onClick={open}>{lagret ? "Vis Tur" : "Lag Tur"}</button>
                {lagret && (
                    <span className="koordinater-lagret-melding">
                        ✓ Koordinater hentet
                    </span>
                )}
            </div>

            <Modal show={isOpen} onClose={close} size="lg">
                <div className="modal-map-container">
                    <Nytur 
                        rutePunkter={rutePunkter}
                        setRutePunkter={setRutePunkter}
                        onLagreKoordinater={handleLagreKoordinater}
                    />
                </div>
            </Modal>
        </PageWrapper>
    );
}