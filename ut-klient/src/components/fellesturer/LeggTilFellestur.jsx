import { useEnums } from "../../hooks/useEnums";
import { useFetchTurer } from "../../hooks/useFetchTurer";
import { useState, useRef } from "react";
import {toggleDatoArray , formatNorskdato} from "../../utils/datoUtils";
import { useModal } from "../../hooks/useModal";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

import DatePicker, { registerLocale } from "react-datepicker";
import Modal from "../../modal/Modal"
import nb from 'date-fns/locale/nb';
import "./LeggTilFellestur.css";
import "react-datepicker/dist/react-datepicker.css";

registerLocale('nb', nb);

//Laget av Kay
export default function LeggTilFellestur(){
    const { isOpen, open, close } = useModal(); 
    const { t } = useTranslation();
    const { enumData: aktivitet_status} = useEnums("aktivitet_status_enum");
    const { turer } = useFetchTurer(true);

    const [søk, setSøk] = useState("");
    const [visDropdown, setVisDropdown] = useState(false);
    const [valgteDatoer, setValgteDatoer] = useState([]);
    const [midlertidigDato, setMidlertidigDato] = useState(new Date()); 
    const [valgtTurruteId, setValgtTurruteId] = useState(0);
    const [tittel, setTittel] = useState("");
    const [beskrivelse, setBeskrivelse] = useState("");
    const [brukerId, setBrukerId] = useState(0);
    const [minDeltakere, setMinDeltakere] = useState(0);
    const [maksDeltakere, setMaksDeltakere] = useState(0);
    const [bildeUrl, setBildeUrl] = useState("");
    const [status, setStatus] = useState("");
    const uploaderRef = useRef(null);
    
    const leggTilDato = (nyDato) => {
        setValgteDatoer(prev => toggleDatoArray(prev, nyDato));
    }

    const fjernDato = (dato) => {
        setValgteDatoer(prev => prev.filter(d => d.getTime() !== dato.getTime()));
    }

    const handleDatoChange = (dato) => {
        const erSammeDag = dato.toDateString() === midlertidigDato.toDateString();
        setMidlertidigDato(dato);

        if (erSammeDag) {
            leggTilDato(dato);
        }
    }

    //Når min deltakere går over maks, blir maksDeltakere oppdatert
    const handleMinChange = (verdi) => {
        const nummer = Number(verdi);
        setMinDeltakere(nummer);

        if(nummer > maksDeltakere) {
            setMaksDeltakere(nummer);
        }
    }

    //Hvis bruker skriver inn en verdi i maksDeltakere som er mindre enn min, blir verdien rettet opp til lik verdi som minDeltakere
    const handleMaksChange = (verdi) => {
        if (verdi === ""){
            setMaksDeltakere("");
            return;
        }

        const nummer = Number(verdi);
        if(nummer < minDeltakere){
            setMaksDeltakere(minDeltakere);
            return;
        }
        setMaksDeltakere(nummer);
    }

    //håndterer søk
    const filterTurer = turer?.filter(tur =>
        tur.turrute_navn.toLowerCase().includes(søk.toLowerCase()) ||   //søk på tur navn
        tur.turrute_id.toString().includes(søk)                         //søk på ID
    ) || [];

    console.log(valgtTurruteId);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(valgteDatoer === 0) {
            toast.error("Vennligst velg minst en dato")
        }

        const fellesturData = {
        tittel:         tittel,
        beskrivelse:    beskrivelse,
        minDeltakere:   minDeltakere,
        maksDeltakere:  maksDeltakere,
        turruteId:      valgtTurruteId,
        status:         status,
        datoer:         valgteDatoer.map(dato => dato.toISOString()),
        brukerID:       brukerId,
        bilder:         bildeUrl
    };

    //TODO: send til backend

    }
    

    return (
        <>
        <div className="fellestur-forum-container">
            <form>
                {/*Turrute som skal brukes til fellestur*/}
                <div className="input-container søk">
                    <label className="input">
                        Velg Turrute
                    <input
                        type="text"
                        id="tur_søk"
                        value={søk}
                        onChange={(e) => {
                            setSøk(e.target.value);
                            setVisDropdown(true);
                            if (e.target.value === 0) setValgtTurruteId(0);
                        }}
                        onFocus={() => setVisDropdown(true)}
                        required
                    />
                    </label>

                    {/*Dropdown til søk*/}
                    {visDropdown && søk && (
                        <ul className="søkeresultater">
                            {filterTurer.length > 0 ? (
                                filterTurer.map((tur) => (
                                    <li
                                        key={tur.turrute_id}
                                        onClick={() => {
                                            setSøk(tur.turrute_navn);
                                            setValgtTurruteId(tur.turrute_id)
                                            setVisDropdown(false);
                                        }}
                                    >
                                    <span className="tur-id">#{tur.turrute_id}</span> {tur.turrute_navn}
                                    </li>
                                ))
                            ) : (
                                <li className="ingen-resultater">Ingen turer funnet</li>
                            )}
                        </ul>
                    )}
                </div>

                {/*Tittel på fellestur*/}
                <div className="input-container">
                    <label className="input">
                        Tittel
                    <input
                        type="text"
                        id="tittel"
                        value={tittel}
                        onChange={(e) => setTittel(e.target.value)}
                        pattern="^[A-Za-zØÆÅøæå\s]{3,20}$"
                        required
                    />
                    </label>
                </div>

                {/*Beskrivelse av fellesturen*/}
                    <div className="input-container">
                    <label className="input">
                        Beskrivelse
                    <textarea
                        id="beskrivelse"
                        rows="5"
                        style={{resize: 'none'}}
                        value={beskrivelse}
                        onChange={(e) => setBeskrivelse(e.target.value)}
                        pattern="^[A-Za-zØÆÅøæå\s]{3,100}$"
                        required
                    />
                    </label>
                </div>

                {/*Valg av datoer + tidspunkt*/}
                    <div className="input-container">
                        <label className="input">
                            Velg dato(er)
                            <button type="button" className="velg-dato-btn" onClick={open}>
                                {valgteDatoer.length > 0 
                                ? `${valgteDatoer.length} datoer valgt`
                                : "Åpne kalender"}
                            </button>

                        </label>
                    </div>
                    {valgteDatoer.length > 0 && (
                        <div className="valgtedatoer">
                            {valgteDatoer.map((dato, index) => (
                            <span key={index} className="dato-valg">
                                {formatNorskdato(dato)}
                                <button type="button" style={{marginLeft: "5px"}} onClick={() => fjernDato(dato)}>x</button>
                            </span>
                        ))}     
                        </div>
                    )}

                    
                    {/*BrukerID. Dette blir sendt inn automatisk. Vises kun i testing*/}
                    <div className="input-container">
                    <label className="input">
                        BrukerID
                    <input
                        type="text"
                        id="bruker_id"
                        disabled={true}
                        value={1}
                        onChange={(e) => setBrukerId(e.target.value)}
                        required
                    />
                    </label>
                </div>

                {/*Min deltakere til fellesturen*/}
                    <div className="input-container">
                    <label className="input">
                        Min deltakere
                    <input
                        type="number"
                        id="min_deltakere"
                        value={minDeltakere}
                        onChange={(e) => handleMinChange(e.target.value)}
                        min="1"
                        max="1000"
                        required
                    />
                    </label>
                </div>

                {/*Maks deltakere til fellesturen*/}        
                     <div className="input-container">
                    <label className="input">
                        Maks deltakere
                    <input
                        type="number"
                        id="maks_deltakere"
                        value={maksDeltakere}
                        onChange={(e) => handleMaksChange(e.target.value)}
                        min="1"
                        max="1000"
                        required
                    />
                    </label>
                </div>

                {/*Bildeopplasting til fellesturen. Denne er laget av Olai*/}
                    <div className="input-container">
                    <label>{t("admin.last_opp_bilde")}:</label>
                    <simple-file-upload
                        accept="image/*"
                        max-file-size="5242880"
                        max-files="5"
                        ref={uploaderRef}
                        public-key={import.meta.env.VITE_SFU_PUBLIC_KEY}
                    ></simple-file-upload>
                    </div>

                    {/*Mulighet for å legge til en bildeurl. KUN til testing. HUSK å fjerne*/}
                    <div className="input-container">
                   <label className="input">Bilde url (kun til testing. HUSK å fjerne denne!)
                    <input
                        type="text"
                        id="bilde_url"
                        value={bildeUrl}
                        onChange={(e) => setBildeUrl(e.target.value)}
                    >
                    </input>
                    </label>
                    </div>

                    {bildeUrl && (
                        <div style={{ marginTop: '10px' }}>
                            <p>{t("admin.bilde_lastet_opp")}</p>
                            <img 
                                src={`${bildeUrl}?w=200&h=200&fit=fit`} 
                                alt="Preview" 
                            />
                        </div>
                    )}
                {/*Status på fellesturen*/}
                    <div className="input-container">
                    <label className="input">
                        Status
                    <select
                        type="text"
                        id="aktivitet_status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                    <option value="" disabled selected hidden></option>
                        {aktivitet_status.map((valg) => (
                            <option key={valg} value={valg}>
                                {valg}
                            </option>
                        ))}
                    </select>
                    </label>
                </div>         
        
            </form>

            {/*Model til valg av dato + tidspunkt*/}
                <Modal 
                    show={isOpen} 
                    onClose={close} 
                    title="Velg dato og tid"
                    size="sm"
                >
                    <div className="modal-calendar-container">
                        <DatePicker
                            inline
                            locale="nb"
                            selected={midlertidigDato}
                            highlightDates={valgteDatoer}
                            onChange={handleDatoChange}
                            onMonthChange={(dato) => setMidlertidigDato(dato)}
                            calendarStartDay={1}
                            shouldCloseOnSelect={false}
                            minDate={new Date()}

                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="Tid"
                            dateFormat="d. MMMM yyyy HH:mm"
                        /> 
                    </div>
                </Modal>
        </div>
        </>
    );
}
