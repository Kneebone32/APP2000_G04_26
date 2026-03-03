import { useTurmål } from "../../../hooks/useTurmål";
import TurmålForm from "./../turmål-form/TurmålForm"
import { Bounce, Flip, Slide, toast } from 'react-toastify';
import { useTranslation } from "react-i18next";


//Oppretter ett nytt Turmål. Laget av Kay
export default function LeggTilTurmål() {
    const { t } = useTranslation();
    const { opprettTurmål } = useTurmål({})
    
    const handleOpprett = async (formData) => {
        try {
            //await opprettTurmål(formData);
            toast.info(t("turmål.backend_melding"), {
            progress: undefined,
            theme: "dark",
            transition: Flip
            });


        } catch (err) {
             console.log(err)
        }
    };

    return (
        <div className="turmål-form-container">
            <h1>{t("turmål.legg_til")}</h1>
            <TurmålForm 
                onSubmitAction={handleOpprett} 
                buttonTekst={t("turmål.lagre")} 
            />
        </div>
    );
}