import { useFellestur } from "../../../hooks/useFellesturer";
import FellesturForm from "./../fellestur-form/FellesturForm"
import { Slide, toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

//Oppretter en ny Fellestur. Laget av Kay
export default function LeggTilFellestur() {
    const { t } = useTranslation();
    const { opprettFellestur } = useFellestur({})
    
    const handleOpprett = async (formData) => {
    
        try {
            await opprettFellestur({ ...formData, brukerId: "1" });
            toast.info(t("fellesturer.backend_melding"), {
            progress: undefined,
            theme: "dark",
            transition: Slide
            });

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="fellestur-form-container">
            <h1>{t("fellesturer.legg_til")}</h1>
            <FellesturForm 
                onSubmitAction={handleOpprett} 
                buttonTekst={t("fellesturer.lagre")} 
            />
        </div>
    );
}