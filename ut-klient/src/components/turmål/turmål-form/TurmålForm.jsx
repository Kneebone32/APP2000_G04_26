import NyttKoordinat from "../../NyttKoordinat";
import Modal from "../../../modal/Modal";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { turmålIcon } from "../../kart/KartBasic";
import { hentHøydeMåling, hentKommuneData } from "../../../utils/geoUtils"
import "./TurmålForm.css"

//Bygger opp alt som skal være med for å opprette ett Turmål. Laget av Kay
export default function TurmålForm({lagretData = {}, onSubmitAction, buttonTekst}){
    const {isOpen, open, close} = useModal();
    const [lagretKoordinat, setLagretKoordinat] = useState(null);
    const [tittel, setTittel] = (lagretData.tittel || "");
    const [lagret, setLagret] = useState(lagretData || false);
    const [høydeMeter, setHøydeMeter] = useState(lagretData.høyde || "");
    const [kommune, setKommune] = useState(lagretData.kommune || "");
    const [kommuneID, setKommuneID] = useState(lagretData.kommuneID || "");
    const [fylke, setFylke] = useState(lagretData.fylke || "");
    const [fylkeID, setFylkeID] = useState(lagretData.fylkeID || "");
    

    const handleLagreKoordinat = async (koord) => {
        const høyde = await hentHøydeMåling(koord[0], koord[1]);
        const kommunedata = await hentKommuneData(koord[0], koord[1]) 
        setLagretKoordinat(koord[0].toFixed(5) + ", " + koord[1].toFixed(5));
        setHøydeMeter(høyde);
        setFylke(kommunedata.fylkesnavn);
        setKommune(kommunedata.kommunenavn);
        setLagret(true);
        close();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const turmåldata = {
            navn: tittel,
            koordinater: lagretKoordinat,
            høyde: høydeMeter,
            kommuneID: kommuneID,
            fylkeID: fylkeID
        };

        onSubmitAction(turmåldata);
    };

    

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="input-container">
                <label className="input"> Navn
                    <input type="text" value={tittel} onChange={(e) => setTittel(e.target.value)} required />
                </label>
            </div>
            <div className="input-container">
                <button onClick={open} className="åpne-kart-btn">Velg posisjon</button>
            </div>

            {høydeMeter && (
                <> 
                    <div className="input-container">
                        <label className="input"> Koordinater
                            <input type="text" value={lagretKoordinat} disabled={true}></input>
                        </label>
                    </div>
                    <div className="input-container">
                        <label className="input"> Høyde
                            <input type="text" value={høydeMeter} disabled={true}></input>
                        </label>
                    </div>
                    <div className="input-container">
                        <label className="input"> Kommune
                            <input type="text" value={kommune} disabled={true}></input>
                        </label>
                    </div>
                    <div className="input-container">
                        <label className="input"> Fylke
                            <input type="text" value={fylke} disabled={true}></input>
                        </label>
                    </div>
                    {/*Knapp til å lagre eller oppdatere fellesturen*/}
                    <div className="input-container">
                        <button type="submit" className="lagre-btn">{buttonTekst}</button>
                    </div>
                </>

                )}
                

                     <Modal show={isOpen} onClose={close} title="Velg Turmål" size="lg">
                         <div className="modal-map-container">
                             <NyttKoordinat 
                                onLagreKoordinat={handleLagreKoordinat}
                                ikon={turmålIcon}
                             />
                         </div>
                     </Modal>   
        </form>
    )
}