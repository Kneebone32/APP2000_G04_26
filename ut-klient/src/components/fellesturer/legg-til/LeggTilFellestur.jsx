import { useState} from "react";
import { useTranslation } from "react-i18next";
import { Bounce, Slide, toast } from 'react-toastify';
import DatePicker, { registerLocale } from "react-datepicker";
import nb from 'date-fns/locale/nb';
import { useEnums } from "../../../hooks/useEnums";
import { useFetchTurer } from "../../../hooks/useFetchTurer";
import { useModal } from "../../../hooks/useModal";
import { toggleDatoArray } from "../../../utils/datoUtils";
import Modal from "../../../modal/Modal"
import TurruteSok from "./TurruteSøk"
import DeltakerInput from "./DeltakerInput";
import DatoListe from "./DatoListe";
import BildeOpplasting from "../../BildeOpplasting";
import "./LeggTilFellestur.css";
import "react-datepicker/dist/react-datepicker.css";

registerLocale('nb', nb);

//Samlefil for å legge til fellesturer. Laget av Kay
export default function LeggTilFellestur() {
    const { isOpen, open, close } = useModal();
    const { t } = useTranslation();
    const { enumData: aktivitet_status } = useEnums("aktivitet_status_enum");
    const { turer } = useFetchTurer(true);

    //fellestur form
    const [valgtTurruteId, setValgtTurruteId] = useState(0);
    const [tittel, setTittel] = useState("");
    const [beskrivelse, setBeskrivelse] = useState("");
    const [valgteDatoer, setValgteDatoer] = useState([]);
    const [midlertidigDato, setMidlertidigDato] = useState(new Date()); 
    const [minDeltakere, setMinDeltakere] = useState(1);
    const [maksDeltakere, setMaksDeltakere] = useState(1);
    const [status, setStatus] = useState("");
    const [bildeUrl, setBildeUrl] = useState("");


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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (valgteDatoer.length === 0) {
            return toast.error("Vennligst velg minst en dato");
        }

        const fellesturData = {
            tittel,
            beskrivelse,
            minDeltakere,
            maksDeltakere,
            brukerId: "1",
            turruteId: valgtTurruteId,
            status,
            datoer: valgteDatoer.map(d => d.toISOString()),
            bilder: bildeUrl
        };

        console.log(fellesturData);

        toast.info('Jippi! Du gjorde alt riktig, men denne er ikke koblet til backend enda... :S', {
        progress: undefined,
        theme: "dark",
        transition: Slide
        });
    };

    return (
        <div className="fellestur-forum-container">
            <form onSubmit={handleSubmit}>

                {/*Turrute som skal brukes til fellestur*/}
                <TurruteSok 
                    turer={turer} 
                    onSelect={(id) => setValgtTurruteId(id)} 
                />

                {/*Tittel på fellestur*/}
                <div className="input-container">
                    <label className="input">Tittel
                        <input 
                        type="text" 
                        value={tittel} 
                        onChange={(e) => setTittel(e.target.value)} 
                        required 
                        />
                    </label>
                </div>

                {/*Beskrivelse av fellesturen*/}
                <div className="input-container">
                    <label className="input">Beskrivelse
                        <textarea style={{resize: 'none'}} 
                        rows="5" 
                        value={beskrivelse} 
                        onChange={(e) => setBeskrivelse(e.target.value)} 
                        required 
                        />
                    </label>
                </div>

                {/*Valg av datoer + tidspunkt*/}
                <div className="input-container">
                    <label className="input">Velg dato(er) </label>
                        <button type="button" className="velg-dato-btn" onClick={open}>
                            {valgteDatoer.length > 0 ? `${valgteDatoer.length} datoer valgt` : "Åpne kalender"}
                        </button>
                    <DatoListe valgteDatoer={valgteDatoer} onSlett={fjernDato} />
                </div>

                {/*Min & Maks deltakere til fellesturen*/}
                <DeltakerInput 
                    minDeltakere={minDeltakere} 
                    maksDeltakere={maksDeltakere} 
                    onMinChange={handleMinChange} 
                    onMaksChange={handleMaksChange} 
                />
                
                {/*Bildeopplasting*/}
                <BildeOpplasting 
                    bildeUrl={bildeUrl}
                    setBildeUrl={setBildeUrl}
                />

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
                        <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                        required
                        >
                            <option value="" disabled hidden></option>
                            {aktivitet_status.map(valg => <option key={valg} value={valg}>{valg}</option>)}
                        </select>
                    </label>
                </div>

                <button type="submit" className="lagre-btn">Lagre Fellestur</button>
            </form>

            {/*Modal til kalender*/}
            <Modal show={isOpen} onClose={close} title="Velg dato og tid" size="sm">
                <div className="modal-calendar-container">
                    <DatePicker
                        inline locale="nb" 
                        selected={midlertidigDato} 
                        highlightDates={valgteDatoer}
                        onChange={handleDatoChange} 
                        minDate={new Date()} 
                        showTimeSelect
                        timeFormat="HH:mm" 
                        timeIntervals={15} 
                        timeCaption="Tid"
                    /> 
                </div>
            </Modal>
        </div>
    );
}