import { useState } from "react";
//import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { useEnums } from "../../../hooks/useEnums";
import { useFetchTurer } from "../../../hooks/useFetchTurer";
import { useModal } from "../../../hooks/useModal";
import { toggleDatoArray } from "../../../utils/datoUtils";
import Modal from "../../../modal/Modal";
import TurruteSøk from "./TurruteSøk";
import DeltakerInput from "./DeltakerInput";
import DatoListe from "./DatoListe";
import BildeOpplasting from "../../BildeOpplasting";
import { toast } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import "./FellesturForm.css"

//all brukerinput til fellesturer. Laget av Kay
//TODO: match feltnavn på data som kommer fra databasen. Eks. lagretData.turruteId eller lagretData.turrute_id?
export default function FellesturForm({ lagretData = {}, onSubmitAction, buttonTekst }) {
    const { isOpen, open, close } = useModal();
    //const { t } = useTranslation();
    const { enumData: aktivitet_status } = useEnums("aktivitet_status_enum");
    const { turer } = useFetchTurer(true);
    const [valgtTurruteId, setValgtTurruteId] = useState(lagretData.turruteId || 0);
    const [tittel, setTittel] = useState(lagretData.tittel || "");
    const [beskrivelse, setBeskrivelse] = useState(lagretData.beskrivelse || "");
    const [midlertidigDato, setMidlertidigDato] = useState(new Date());
    const [minDeltakere, setMinDeltakere] = useState(lagretData.minDeltakere || 1);
    const [maksDeltakere, setMaksDeltakere] = useState(lagretData.maksDeltakere || 1);
    const [status, setStatus] = useState(lagretData.status || "");
    const [bildeUrl, setBildeUrl] = useState(lagretData.bilder || []); 
    const [valgteDatoer, setValgteDatoer] = useState(
        lagretData.datoer ? lagretData.datoer.map(d => new Date(d)) : []
    );


    const handleDatoChange = (dato) => {
        const erSammeDag = dato.toDateString() === midlertidigDato.toDateString();
        setMidlertidigDato(dato);
        if (erSammeDag) {
            setValgteDatoer(prev => toggleDatoArray(prev, dato));
        }
    };

    const fjernDato = (dato) => {
        setValgteDatoer(prev => prev.filter(d => d.getTime() !== dato.getTime()));
    };


    const handleMinChange = (verdi) => {
        const nummer = Number(verdi);
        setMinDeltakere(nummer);
        if (nummer > maksDeltakere) setMaksDeltakere(nummer);
    };

    const handleMaksChange = (verdi) => {
        if (verdi === "") { setMaksDeltakere(""); return; }
        const nummer = Number(verdi);
        setMaksDeltakere(nummer < minDeltakere ? minDeltakere : nummer);
    };


    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (valgteDatoer.length === 0) {
            return toast.error("Vennligst velg minst en dato");
        }

        const fellesturData = {
            tittel,
            beskrivelse: beskrivelse.trim(),
            minDeltakere,
            maksDeltakere,
            turruteId: valgtTurruteId,
            status,
            datoer: valgteDatoer.map(d => d.toISOString()),
            bilder: bildeUrl
        };

        onSubmitAction(fellesturData);
    };

    return (
        <form onSubmit={handleFormSubmit}>

            {/*Turrute som skal brukes til fellestur*/}
            <TurruteSøk 
                turer={turer} 
                onSelect={(id) => setValgtTurruteId(id)} 
            />

            {/*Tittel på fellestur*/}
            <div className="input-container">
                <label className="input">Tittel
                    <input type="text" value={tittel} onChange={(e) => setTittel(e.target.value)} required />
                </label>
            </div>

            {/*Beskrivelse av fellesturen*/}
            <div className="input-container">
                <label className="input">Beskrivelse
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

            {/*Valg av datoer + tidspunkt*/}
            <div className="input-container">
                <label className="input-label">Velg dato(er)</label>
                <button type="button" className="velg-dato-btn" onClick={open}>
                    {valgteDatoer.length > 0 ? `${valgteDatoer.length} datoer valgt` : "Åpne kalender"}
                </button>
                <DatoListe valgteDatoer={valgteDatoer} onSlett={fjernDato} />
            </div>

            {/*Min & Maks deltakere til fellesturen*/}
            <DeltakerInput 
                minDeltakere={minDeltakere} maksDeltakere={maksDeltakere} 
                onMinChange={handleMinChange} onMaksChange={handleMaksChange} 
            />
            
            {/*Bildeopplasting*/}
            <BildeOpplasting bildeUrl={bildeUrl} setBildeUrl={setBildeUrl} />

            {/*Mulighet for å legge til en bildeurl. KUN til testing. HUSK å fjerne*/}
            <div className="input-container">
                <label className="input">Bilde url (kun til testing. HUSK å fjerne denne!)
                    <input
                        type="text"
                        id="bilde_url"
                        value={bildeUrl}
                        onChange={(e) => setBildeUrl(e.target.value)}
                    />
                </label>
            </div>

            {/*Status*/}
            <div className="input-container">
                <label className="input">Status
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="" disabled hidden></option>
                        {aktivitet_status.map(valg => <option key={valg} value={valg}>{valg}</option>)}
                    </select>
                </label>
            </div>

            {/*Knapp til å lagre eller oppdatere fellesturen*/}
            <button type="submit" className="lagre-btn">{buttonTekst}</button>


            <Modal show={isOpen} onClose={close} title="Velg dato og tid" size="sm">
                <div className="modal-calendar-container">
                    <DatePicker
                        inline locale="nb" selected={midlertidigDato} highlightDates={valgteDatoer}
                        onChange={handleDatoChange} minDate={new Date()} showTimeSelect
                        timeFormat="HH:mm" timeIntervals={15} timeCaption="Tid"
                    /> 
                </div>
            </Modal>
        </form>
    );
}