import "./Test.css";
import PageWrapper from "../components/PageWrapper";
import Modal from "../modal/Modal";
import Nytur from "../components/Nytur";
import { useModal } from "../hooks/useModal";
import { useState } from "react";
import { GpxParser } from "../components/GpxParser";
import { regnUtTotalLengde, hentHøydeMåling } from "../utils/geoUtils";

export default function Test() {
    const {isOpen, open, close} = useModal();
    const [rutePunkter, setRutePunkter] = useState([]);
    const [lagredeKoordinater, setLagredeKoordinater] = useState(null);
    const [lagret, setLagret] = useState(false);
    const [totalRuteLengde, setTotalRuteLengde] = useState(null);
    const [høydeMeter, setHøydeMeter] = useState(null);

    const handleLagreKoordinater = (koords) => {
        setLagredeKoordinater(koords);
        setTotalRuteLengde(regnUtTotalLengde(koords));
        setLagret(true);
        close();
        console.log(rutePunkter);
    };

    const handleGpxKoordinater = (koords) => {
        setLagredeKoordinater(koords);
        setRutePunkter(koords);
        setTotalRuteLengde(regnUtTotalLengde(koords));
        setHøydeMeter(hentHøydeMåling(59.40795904872306, 9.051981209962618));
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
                    <>
                    <span className="koordinater-lagret-melding">
                        ✓ Koordinater hentet 
                    </span>
                    <span>Rutelengde: {totalRuteLengde.toFixed(3)}KM</span>
                    </>
                )}

                {høydeMeter && (
                    <span>Høyde: {høydeMeter}</span>
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