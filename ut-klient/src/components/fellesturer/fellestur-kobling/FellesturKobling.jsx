import { useState } from "react";
import { useFellestur } from "../../../hooks/useFellesturer";
import { useFetchHytter } from "../../../hooks/useFetchHytter";
import { useTurmål } from "../../../hooks/useTurmål";
import HytteSøk from "./HytteSøk";
import FellesturSøk from "../FellesturSøk";
import { minDistTilTur } from "./MinDistTilTur";
import { tur } from "../../../assets/tur";
import { toast } from 'react-toastify';
import TurmålSøk from "../../turmål/TurmålSøk";


//Legger til hytte eller turmål til fellestur. Laget av Kay
export default function FellesturKobling() {
    //fetch
    const {fellestur, hentFellesturFraId, redigerFellestur} = useFellestur({autoFetch: true}); //redigerFellestur? eller ny func for å sette inn hytte/turmål?
    const { hytter, hentHytteFraId } = useFetchHytter(true);
    const { turmål, hentTurmålFraId } = useTurmål({autoFetch: true});

    //hytter
    const [valgtHytteData, setValgtHytteData] = useState(null);
    const [lasterHytte, setLasterHytte] = useState(false);
    //fellesturer
    const [valgtFellesturData, setValgtFellestuData] = useState(null);
    const [lasterFellestur, setLasterFellestur] = useState(false);
    const [testFellestur, setTestFellestur] = useState(tur);
    //turmål
    const [valgtTurmålData, setValgtTurmålData] = useState(null);
    const [lasterTurmål, setLasterTurmål] = useState(false);

    const maksTillattAvstandKM = 5; 

    //Fellestur
    const handleFellesturSøkSelect = async (id) => {
        if (!id) {
            setValgtFellestuData(null);
            return;
        }
        setLasterFellestur(true);
        try {
            //const data = await hentFellesturFraId(id);
            //setValgtFellestuData(data);
            setTestFellestur(tur);

        } catch (err) {
            toast.error("Kunne ikke hente fellestur: " + err.message);
            setValgtFellestuData(null);
        } finally {
            setLasterFellestur(false);
        }
    };

    //Hytte
    const handleHytteSøkSelect = async (id) => {
        if (!id) {
            setValgtHytteData(null);
            return;
        }
        setLasterHytte(true);
        try {
            const data = await hentHytteFraId(id);
            const minDist = minDistTilTur(data.hytte_breddegrad, data.hytte_lengdegrad, testFellestur);

            if ( minDist > maksTillattAvstandKM) {
                toast(`Opps, hytten er ${minDist.toFixed(2)} KM unna turruten. Maks er ${maksTillattAvstandKM} KM` );
                setValgtHytteData(null);
            } else{
                setValgtHytteData(data);
            }
        } catch (err) {
            toast.error("Kunne ikke hente hytte: " + err.message);
            setValgtHytteData(null);
        } finally {
            setLasterHytte(false);
        }
    };

    //Turmål
    const handleTurmålSøkSelect = async (id) => {
        if (!id) {
            setValgtTurmålData(null);
            return;
        }
        setLasterTurmål(true);
        try {
            const data = await hentTurmålFraId(id);
            const minDist = minDistTilTur(data.turmål_breddegrad, data.turmål_lengdegrad, testFellestur);

            if ( minDist > maksTillattAvstandKM) {
                toast(`Opps, turmålet er ${minDist.toFixed(2)} KM unna turruten. Maks er ${maksTillattAvstandKM} KM` );
                setValgtTurmålData(null);
            } else{
                setValgtTurmålData(data);
            }
        } catch (err) {
            toast.error("Kunne ikke hente Turmål: " + err.message);
            setValgtTurmålData(null);
        } finally {
            setLasterTurmål(false);
        }
    };

    return (
        <>
        <h2>Legg til hytte eller turmål i Fellestur</h2>
        {/*Søkefelt til fellestur*/}
        <FellesturSøk 
            fellesturer={fellestur} 
            onSelect={handleFellesturSøkSelect} 
            lagretTittel={valgtFellesturData?.tittel || ""}
            
        />
        {/*Viser innsetting av Hytte og Turmål når bruker har valgt fellestur. Husk å endre !valgtFellesturData*/}
        {!lasterFellestur && !valgtFellesturData ? (
            <>
            <HytteSøk
            hytter={hytter} 
            onSelect={handleHytteSøkSelect} 
            lagretTittel={valgtHytteData?.tittel || ""}
            />
            
            {valgtHytteData && (
                <>
                    <input type="text" value={(valgtHytteData.hytte_breddegrad) + ", " + (valgtHytteData.hytte_lengdegrad)} disabled={true}></input>
                </>
            )}

            {/* 
            <TurmålSøk
            turmål={turmål} 
            onSelect={handleTurmålSøkSelect} 
            lagretTittel={valgtTurmålData?.tittel || ""}
            />  
            */}
            {valgtTurmålData && (
                <>
                    <input type="text" value={(valgtTurmålData.turmål_breddegrad) + ", " + (valgtTurmålData.turmål_lengdegrad)} disabled={true}></input>
                </>
            )}
            </>
        ) : (
                <p style={{color: "#888"}}>Velg fellestur for å kunne legge til hytte/turmål</p>
            )}
            
        </>
    );

}