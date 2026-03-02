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
import { useTranslation } from "react-i18next";


//Legger til hytte eller turmål til fellestur. Laget av Kay
export default function FellesturKobling() {
    const { t } = useTranslation();
    //fetch
    const {fellestur, hentFellesturFraId, redigerFellestur} = useFellestur({autoFetch: true}); //redigerFellestur? eller ny func for å sette inn hytte/turmål?
    const { hytter, hentHytteFraId } = useFetchHytter({autoFetch: true});
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
            toast.error(t("fellestur_kobling.feil_henting_fellestur") + err.message);
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
            console.log(data)
            const minDist = minDistTilTur(data.koordinater.breddegrad, data.koordinater.lengdegrad, testFellestur);

            if ( minDist > maksTillattAvstandKM) {
                toast(`${t("fellestur_kobling.hytte_for_langt")}${minDist.toFixed(2)}${t("fellestur_kobling.km_unna")}${maksTillattAvstandKM}${t("fellestur_kobling.km")}` );
                setValgtHytteData(null);
            } else{
                setValgtHytteData(data);
            }
        } catch (err) {
            toast.error(t("fellestur_kobling.feil_henting_hytte") + err.message);
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
                toast(`${t("fellestur_kobling.turmål_for_langt")}${minDist.toFixed(2)}${t("fellestur_kobling.km_unna")}${maksTillattAvstandKM}${t("fellestur_kobling.km")}` );
                setValgtTurmålData(null);
            } else{
                setValgtTurmålData(data);
            }
        } catch (err) {
            toast.error(t("fellestur_kobling.feil_henting_turmål") + err.message);
            setValgtTurmålData(null);
        } finally {
            setLasterTurmål(false);
        }
    };

    return (
        <>
        <h2>{t("fellestur_kobling.tittel")}</h2>
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
            lagretTittel={valgtHytteData?.navn || ""}
            />
            
            {valgtHytteData && (
                <>
                    <input type="text" value={(valgtHytteData.koordinater.breddegrad) + ", " + (valgtHytteData.koordinater.lengdegrad)} disabled={true}></input>
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
                <p style={{color: "#888"}}>{t("fellestur_kobling.velg_fellestur")}</p>
            )}
            
        </>
    );

}