import NyttKoordinat from "../../NyttKoordinat";
import Modal from "../../../modal/Modal";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { turmålIcon } from "../../kart/KartBasic";
import { hentHøydeMåling, hentKommuneData } from "../../../utils/geoUtils"
import TempBilde from "../../TempBilde";
import BildeOpplasting from "../../BildeOpplasting";
import { useTranslation } from "react-i18next";
import "./TurmålForm.css"

//Bygger opp alt som skal være med for å opprette ett Turmål. Laget av Kay
export default function TurmålForm({lagretData = {}, onSubmitAction, buttonTekst}){
    const { t } = useTranslation();
    const {isOpen, open, close} = useModal();
    const [lagretKoordinat, setLagretKoordinat] = useState(null);
    const [tittel, setTittel] = useState(lagretData.tittel || "");
    const [lagret, setLagret] = useState(lagretData || false);
    const [høydeMeter, setHøydeMeter] = useState(lagretData.høyde || "");
    const [breddegrad, setBreddegrad] = useState(lagretData.høyde || 0);
    const [lengdegrad, setLengdegrad] = useState(lagretData.høyde || 0);
    const [beskrivelse, setBeskrivelse] = useState(lagretData.beskrivelse || "");
    const [bildeUrl, setBildeUrl] = useState(lagretData.bilder || []); 
    const [tempUrl, setTempUrl] = useState("");
    const [kommune, setKommune] = useState(lagretData.kommune || "");
    const [kommuneID, setKommuneID] = useState(lagretData.kommuneID || "");
    const [fylke, setFylke] = useState(lagretData.fylke || "");
    const [fylkeID, setFylkeID] = useState(lagretData.fylkeID || "");
    

    const handleLagreKoordinat = async (koord) => {
        const høyde = await hentHøydeMåling(koord[0], koord[1]);
        const kommunedata = await hentKommuneData(koord[0], koord[1]) 
        setLagretKoordinat(koord[0].toFixed(5) + ", " + koord[1].toFixed(5));
        setHøydeMeter(høyde);
        setBreddegrad(koord[0].toFixed(5));
        setLengdegrad(koord[1].toFixed(5));
        setFylke(kommunedata.fylkesnavn);
        setFylkeID(kommunedata.fylkesnummer);
        setKommune(kommunedata.kommunenavn);
        setKommuneID(kommunedata.kommunenummer);
        setLagret(true);
        close();
    };

    const handleLeggTilBilde = (e) => {
        e.preventDefault();
    
        if (tempUrl.trim() !== "") {
            setBildeUrl([...bildeUrl, tempUrl]); 
            setTempUrl(""); 
        }
    };


    const handleFormSubmit = (e) => {
        e.preventDefault();

        const turmåldata = {
            turmaal_navn: tittel,
            koordinater: lagretKoordinat,
            turmaal_beskrivelse: beskrivelse.trim(),
            turmaal_breddegrad: breddegrad,
            turmaal_lengdegrad: lengdegrad,
            turmaal_moh: parseInt(høydeMeter),
            kommune_nummer: kommuneID,
            fylke_nummer: fylkeID,
            bilder: bildeUrl
        };

        onSubmitAction(turmåldata);
    };

    

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="input-container">
                <label className="input">{t("turmål.navn")}
                    <input type="text" value={tittel} onChange={(e) => setTittel(e.target.value)} required />
                </label>
            </div>
            <div className="input-container">
                <button type="button" onClick={open} className="åpne-kart-btn">{t("turmål.velg_posisjon")}</button>
            </div>

            {/*Beskrivelse av turmålet*/}
            <div className="input-container">
                <label className="input">{t("fellestur_form.beskrivelse")}
                    <textarea 
                        style={{resize: 'none', width: '100%', maxWidth: '400px'}} 
                        rows="5" minLength="20" maxLength="1000"
                        value={beskrivelse} onChange={(e) => setBeskrivelse(e.target.value)} 
                        required 
                    />
                    <small style={{color: beskrivelse.length > 950 ? 'red' : '#666' }}>
                        {beskrivelse.length} / 1000
                    </small>
                </label>
            </div>

            {/*Bildeopplasting*/}
            <BildeOpplasting bildeUrl={bildeUrl} setBildeUrl={setBildeUrl} />
            
            {/*Mulighet for å legge til en bildeurl. KUN til testing. HUSK å fjerne*/}
            <TempBilde  tempUrl={tempUrl} setTempUrl={setTempUrl} onLeggTil={handleLeggTilBilde} />

            
            {høydeMeter && (
                <> 
                    <div className="input-container">
                        <label className="input">{t("turmål.koordinater")}
                            <input type="text" value={lagretKoordinat} disabled={true}></input>
                        </label>
                    </div>
                    <div className="input-container">
                        <label className="input">{t("turmål.høyde")}
                            <input type="text" value={høydeMeter} disabled={true}></input>
                        </label>
                    </div>
                    <div className="input-container">
                        <label className="input">{t("turmål.kommune")}
                            <input type="text" value={kommune} disabled={true}></input>
                        </label>
                    </div>
                    <div className="input-container">
                        <label className="input">{t("turmål.fylke")}
                            <input type="text" value={fylke} disabled={true}></input>
                        </label>
                    </div>


                    {/*Knapp til å lagre eller oppdatere fellesturen*/}
                    <div className="input-container">
                        <button type="submit" className="lagre-btn">{buttonTekst}</button>
                    </div>
                </>

                )}
                

                     <Modal show={isOpen} onClose={close} title={t("turmål.velg_turmål")} size="lg">
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