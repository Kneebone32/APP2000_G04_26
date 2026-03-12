import NySti from "../components/stier/NySti";
import PageWrapper from "../components/PageWrapper";
import Modal from "../modal/Modal";
import { useModal } from "../hooks/useModal";
import { useState } from "react";
import { useTurmål } from "../hooks/useTurmål";
import { useFetchHytter } from "../hooks/useFetchHytter";
import { useStier } from "../hooks/useStier";
import { toast } from "react-toastify";


export default function Test2(){
    const { hytter } = useFetchHytter({autoFetch: true});
    const { turmål } = useTurmål({autoFetch: true});
    const { opprettSti } = useStier({})
    const {isOpen, open, close} = useModal();
    const [rutePunkter, setRutePunkter] = useState([]);
    const [lagredeKoordinater, setLagredeKoordinater] = useState(null);
    const [lagret, setLagret] = useState(false);
    


    const handleLagreKoordinater = async (koords) => {
        setLagredeKoordinater(koords);
        setLagret(true);
        close();
        try {
            await opprettSti(koords);
            toast.success("Sti opprettet!");
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };


    return (
        <PageWrapper>
            <button onClick={open}>{lagret ? "Vis Sti" : "Lag Sti"}</button>
            <Modal show={isOpen} onClose={close} size="lg">
                <div className="modal-map-container">
                    <NySti 
                        rutePunkter={rutePunkter}
                        setRutePunkter={setRutePunkter}
                        onLagreKoordinater={handleLagreKoordinater}
                        hytter={hytter}
                        turMål={turmål}
    
                    />
                </div>
            </Modal>
        </PageWrapper>
    )
}