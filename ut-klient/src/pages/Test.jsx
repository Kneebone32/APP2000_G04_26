import "./Test.css";
import PageWrapper from "../components/PageWrapper";
import Modal from "../modal/Modal";
import Nytur from "../components/Nytur";
import { useModal } from "../hooks/useModal";
import { useState } from "react";
import { GpxParser } from "../components/GpxParser";
import { regnUtTotalLengde, hentHøydeMåling } from "../utils/geoUtils";
import BildeOpplasting from "../components/BildeOpplasting";
import TempBilde from "../components/TempBilde";



export default function Test() {
    const {isOpen, open, close} = useModal();
    const [rutePunkter, setRutePunkter] = useState([]);
    const [hytterITuren, setHytterITuren] = useState([]);
    const [turmålITuren, setTurmålITuren] = useState([]);
    const [stierITuren, setStierITuren] = useState([]);
    const [nyeStierITuren, setNyeStierITuren] = useState([]);
    const [lagredeKoordinater, setLagredeKoordinater] = useState(null);
    const [lagret, setLagret] = useState(false);
    const [totalRuteLengde, setTotalRuteLengde] = useState(null);
    const [høydeMeter, setHøydeMeter] = useState(null);
    const [bildeUrl, setBildeUrl] = useState([]); 
    const [tempUrl, setTempUrl] = useState("");

    const handleLagreKoordinater = async (koords) => {
        //setLagredeKoordinater(koords);
        //setTotalRuteLengde(regnUtTotalLengde(koords));
        //setLagret(true);
        close();
    }

    const handleGpxKoordinater = (koords) => {
        setLagredeKoordinater(koords);
        setRutePunkter(koords);
        setTotalRuteLengde(regnUtTotalLengde(koords));
        setHøydeMeter(hentHøydeMåling(59.40795904872306, 9.051981209962618));
        setLagret(true);
    };

    const handleLeggTilBilde = (e) => {
        e.preventDefault();
    
    if (tempUrl.trim() !== "") {
        setBildeUrl([...bildeUrl, tempUrl]); 
        setTempUrl(""); 
    }
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

                {/*Bildeopplasting*/}
                <BildeOpplasting bildeUrl={bildeUrl} setBildeUrl={setBildeUrl} />
                {/*Mulighet for å legge til en bildeurl. KUN til testing. HUSK å fjerne*/}
                <TempBilde  tempUrl={tempUrl} setTempUrl={setTempUrl} onLeggTil={handleLeggTilBilde} />

            </div>

            <Modal show={isOpen} onClose={close} size="lg">
                <div className="modal-map-container">
                    <Nytur 
                        rutePunkter={rutePunkter}
                        setRutePunkter={setRutePunkter}
                        onLagreKoordinater={handleLagreKoordinater}
                        hytterITuren={hytterITuren}
                        setHytterITuren={setHytterITuren}
                        turmålITuren={turmålITuren}
                        setTurmålITuren={setTurmålITuren}
                        stierITuren={stierITuren}
                        setStierITuren={setStierITuren}
                        nyeStier={nyeStierITuren}
                        setNyeStier={setNyeStierITuren}
                    />
                </div>
            </Modal>
        </PageWrapper>
    );
}