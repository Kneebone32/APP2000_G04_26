import NyttKoordinat from "../components/NyttKoordinat";
import PageWrapper from "../components/PageWrapper";
import Modal from "../modal/Modal";
import { useModal } from "../hooks/useModal";
import { useState } from "react";

export default function Test2(){
    const {isOpen, open, close} = useModal();
    const [lagredeKoordinat, setLagredeKoordinat] = useState(null);
    const [lagret, setLagret] = useState(false);
    const [inputText, setInputText] = useState('');

    const handleLagreKoordinat = (koord) => {
        setLagredeKoordinat(koord);
        setInputText(koord[0].toFixed(5) + ", " + koord[1].toFixed(5));
        setLagret(true);
        close();
    };

    
    return (
        <PageWrapper>
            <div className="kart-knapp-container">
                <button onClick={open}>Kart</button>
            </div>
            <div>
                {lagret && (
                    <>
                    <input 
                    type="text" 
                    value={inputText}
                    >
                    </input>
                    </>
                )}
            </div>
                     <Modal show={isOpen} onClose={close} title="Velg hyttelokasjon" size="lg">
                         <div className="modal-map-container">
                             <NyttKoordinat 
                                onLagreKoordinat={handleLagreKoordinat}
                             />
                         </div>
                     </Modal>   

        </PageWrapper>
    )
}