import { useTurmål } from "../../../hooks/useTurmål";
import TurmålForm from "./../turmål-form/TurmålForm"
import { Bounce, Flip, Slide, toast } from 'react-toastify';


//Oppretter ett nytt Turmål. Laget av Kay
export default function LeggTilTurmål() {
    const { opprettTurmål } = useTurmål(false)
    
    const handleOpprett = async (formData) => {
        try {
            //await opprettTurmål(formData);
            toast.info('Jippi! Du gjorde alt riktig, men denne er ikke koblet til backend enda... :S', {
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
            <h1>Legg til turmål</h1>
            <TurmålForm 
                onSubmitAction={handleOpprett} 
                buttonTekst="Lagre Turmål" 
            />
        </div>
    );
}