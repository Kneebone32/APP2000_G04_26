import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GpxParser } from "../../GpxParser";
import { useEnums } from "../../../hooks/useEnums";
import { useModal } from "../../../hooks/useModal";
import { toggleDatoArray } from "../../../utils/datoUtils";
import { VærvarslingUke } from "../../Værvarsling";
import { toast } from 'react-toastify';
import { regnUtTotalLengde } from "../../../utils/geoUtils";
import DatePicker, { registerLocale } from "react-datepicker";
import Modal from "../../../modal/Modal";
import Nytur from "../../Nytur";
import DeltakerInput from "./DeltakerInput";
import DatoListe from "./DatoListe";
import BildeOpplasting from "../../BildeOpplasting";
import TempBilde from "../../TempBilde";
import nb from 'date-fns/locale/nb';
import "react-datepicker/dist/react-datepicker.css";
import "./FellesturForm.css"

registerLocale('nb', nb);

//all brukerinput til fellesturer. Laget av Kay
//TODO: match feltnavn på data som kommer fra databasen. Eks. lagretData.turruteId eller lagretData.turrute_id?
export default function FellesturForm({ lagretData = {}, onSubmitAction, buttonTekst }) {
    const { t } = useTranslation();
    const { enumData: aktivitet_status } = useEnums("aktivitet_status_enum");
    const [rutePunkter, setRutePunkter] = useState([]);
    const [hytterITuren, setHytterITuren] = useState([]);
    const [turmålITuren, setTurmålITuren] = useState([]);
    const [stierITuren, setStierITuren] = useState([]);
    const [nyeStierITuren, setNyeStierITuren] = useState([]);
    const [totalRuteLengde, setTotalRuteLengde] = useState(null);
    const [gpxKoords, setGpxKoords] = useState(null);
    const [tittel, setTittel] = useState(lagretData.tittel || "");
    const [beskrivelse, setBeskrivelse] = useState(lagretData.beskrivelse || "");
    const [midlertidigDato, setMidlertidigDato] = useState(new Date());
    const [minDeltakere, setMinDeltakere] = useState(lagretData.minDeltakere || 1);
    const [maksDeltakere, setMaksDeltakere] = useState(lagretData.maksDeltakere || 1);
    const [status, setStatus] = useState(lagretData.status || "");
    const [bildeUrl, setBildeUrl] = useState(lagretData.bilder || []); 
    const [tempUrl, setTempUrl] = useState("");
    const [valgteDatoer, setValgteDatoer] = useState(
        lagretData.datoer ? lagretData.datoer.map(d => new Date(d)) : []
    );

    const {
        isOpen: kalenderÅpen,
        open: åpneKalender,
        close: lukkKalender
    } = useModal();

    const {
        isOpen: værvarselÅpen,
        open: åpneVærvarsel,
        close: lukkVærvarsel
    } = useModal();    


    const {
        isOpen: lagTurÅpen,
        open: åpneLagTur,
        close: lukkLagTur
    } = useModal();   

    
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

    const handleLeggTilBilde = (e) => {
        e.preventDefault();
    
        if (tempUrl.trim() !== "") {
            setBildeUrl([...bildeUrl, tempUrl]); 
            setTempUrl(""); 
    }
    };

    const handleGpxKoordinater = (koords) => {
        if (koords && koords.length >= 2) {
            setGpxKoords(koords);
            setRutePunkter(koords);
            setTotalRuteLengde(regnUtTotalLengde(koords));
        } else if (koords && koords.length === 1) {
            alert(t("tur.gpx_ett_punkt"));
        }
    };


    const handleLagreKoordinater = async (koords) => {
        setTotalRuteLengde(regnUtTotalLengde(koords));
        lukkLagTur();
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (valgteDatoer.length === 0) {
            return toast.error(t("fellestur_form.feil_minst_en_dato"));
        }

        const fellesturData = {
            tittel,
            beskrivelse: beskrivelse.trim(),
            minDeltakere,
            maksDeltakere,
            hytter: hytterITuren?.map(h => h.hytte_id),
            turmaal: turmålITuren?.map(t => t.turmaal_id),
            stier: stierITuren,
            nyeStier: nyeStierITuren,
            gpx: gpxKoords,
            ruteLengde: totalRuteLengde,
            status,
            datoer: valgteDatoer.map(d => d.toISOString()),
            bilder: bildeUrl
        };

        onSubmitAction(fellesturData);
    };

    return (
        <>
        <form onSubmit={handleFormSubmit}>

            {/*Turrute som skal brukes til fellestur*/}
            {rutePunkter.length < 1  && (
                <div className="input-container">
                <GpxParser onKoordinaterLastet={handleGpxKoordinater} />
                </div>
            )}
            <div className="input-container">
            <button className="input" type="button" onClick={åpneLagTur}>
                {rutePunkter.length > 1 ? t("tur.endre_rute") : t("tur.lag_rute")}
            </button>
            </div>

            {rutePunkter && rutePunkter.length > 0 ? (
                <>
            {/*Tittel på fellestur*/}
            <div className="input-container">
                <label className="input">{t("fellestur_form.tittel")}
                    <input type="text" value={tittel} onChange={(e) => setTittel(e.target.value)} required />
                </label>
            </div>

            {/*Beskrivelse av fellesturen*/}
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

            

            {/*Valg av datoer + tidspunkt*/}
            <div className="input-container">
                <label className="input-label">{t("fellestur_form.velg_datoer")}</label>
                <div className="input-container-kaldender-og-vær-btn">
                <button type="button" className="velg-dato-btn" onClick={åpneKalender}>
                    {valgteDatoer.length > 0 ? `${valgteDatoer.length}${t("fellestur_form.datoer_valgt")}` : t("fellestur_form.åpne_kalender")}
                </button>
                <button type="button" className="værvarsel-langtids" onClick={åpneVærvarsel}>
                    {t("fellestur_form.værvarsel_8_dager")}</button>
                </div>
                <DatoListe valgteDatoer={valgteDatoer} onSlett={fjernDato} lat={rutePunkter[0][0]} lon={rutePunkter[0][1]}/>
            </div>
            

            {/*Min & Maks deltakere til fellesturen*/}
            <DeltakerInput 
                minDeltakere={minDeltakere} maksDeltakere={maksDeltakere} 
                onMinChange={handleMinChange} onMaksChange={handleMaksChange} 
            />
            
            {/*Bildeopplasting*/}
            <BildeOpplasting bildeUrl={bildeUrl} setBildeUrl={setBildeUrl} />

            {/*Mulighet for å legge til en bildeurl. KUN til testing. HUSK å fjerne*/}
            <TempBilde  tempUrl={tempUrl} setTempUrl={setTempUrl} onLeggTil={handleLeggTilBilde} />



            {/*Status*/}
            <div className="input-container">
                <label className="input">{t("fellestur_form.status")}
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="" disabled hidden></option>
                        {aktivitet_status.map(valg => <option key={valg} value={valg}>{t(`enums.aktivitet_status.${valg}`)}</option>)}
                    </select>
                </label>
            </div>

            {/*Knapp til å lagre eller oppdatere fellesturen*/}
            <button type="submit" className="lagre-btn">{buttonTekst}</button>
            </>
            ) : (
                <p style={{color: "#888"}}>{t("fellestur_form.velg_turrute")}</p>
            )}

            <Modal show={kalenderÅpen} onClose={lukkKalender} title={t("fellestur_form.velg_dato_tid")} size="sm">
                <div className="modal-calendar-container">
                    <DatePicker
                        inline locale="nb" selected={midlertidigDato} highlightDates={valgteDatoer}
                        onChange={handleDatoChange} minDate={new Date()} showTimeSelect
                        timeFormat="HH:mm" timeIntervals={15} timeCaption={t("fellestur_form.tid")}
                    /> 
                </div>
            </Modal>
            
            <Modal show={værvarselÅpen} onClose={lukkVærvarsel} title={t("fellestur_form.værvarsel")} size="lg">
                <div className="modal-weather-container">
                    {rutePunkter.length > 0 && (
                    <VærvarslingUke 
                        latitude={rutePunkter[0][0]} 
                        longitude={rutePunkter[0][1]} 
                    />
                    )}
                </div>
            </Modal>
            </form>
            <Modal show={lagTurÅpen} onClose={lukkLagTur} size="lg">
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
            </>
        
    );
}