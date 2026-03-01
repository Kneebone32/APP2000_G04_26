import NyttKoordinat from "../components/NyttKoordinat";
import PageWrapper from "../components/PageWrapper";
import Modal from "../modal/Modal";
import { useModal } from "../hooks/useModal";
import { useState } from "react";
import { hytteIcon } from "../components/kart/KartBasic";
import { hentHøydeMåling } from "../utils/geoUtils";
import { VærvarselDagDetaljert } from "../components/Værvarsling";

export default function Test2(){
    const {isOpen, open, close} = useModal();
    const [lagretKoordinat, setLagretKoordinat] = useState(null);
    const [lagret, setLagret] = useState(false);
    const [inputText, setInputText] = useState('');
    const [høydeMeter, setHøydeMeter] = useState('');

    const handleLagreKoordinat = async (koord) => {
        const høyde = await hentHøydeMåling(koord[0], koord[1]);
        setLagretKoordinat(koord);
        setInputText(koord[0].toFixed(5) + ", " + koord[1].toFixed(5));
        setHøydeMeter(høyde)
        setLagret(true);
        close();
    };
    

    return (
        <PageWrapper>
        
            
            <div className="kart-knapp-container">
                <input type="text" placeholder="Hyttekoordinater" value={inputText} disabled={true}></input>
                <button onClick={open}>Kart</button>
            </div>
            <div>
                {høydeMeter && (
                    <input type="text" placeholder="moh" value={høydeMeter} disabled={true}></input>
                )}

                {lagret && lagretKoordinat && (
                    <VærvarselDagDetaljert 
                     lat={lagretKoordinat[0]}
                     lon={lagretKoordinat[1]}
                     dato={new Date()}
                     />
                     )}
            </div>
                     <Modal show={isOpen} onClose={close} title="Velg hyttelokasjon" size="lg">
                         <div className="modal-map-container">
                             <NyttKoordinat 
                                onLagreKoordinat={handleLagreKoordinat}
                                ikon={hytteIcon}
                             />
                         </div>
                     </Modal>   


                     

        </PageWrapper>
    )
}