import { useFellestur } from "../../../hooks/useFellesturer";
import FellesturForm from "./../fellestur-form/FellesturForm"
import { Slide, toast } from 'react-toastify';

//Oppretter en ny Fellestur. Laget av Kay
export default function LeggTilFellestur() {
    const { opprettFellestur } = useFellestur(false)
    
    const handleOpprett = async (formData) => {
    
        try {
            await opprettFellestur({ ...formData, brukerId: "1" });
            toast.success("Fellestur opprettet!");

        } catch (err) {
            toast.info('Jippi! Du gjorde alt riktig, men denne er ikke koblet til backend enda... :S', {
            progress: undefined,
            theme: "dark",
            transition: Slide
            });
            console.log(err);
        }
    };

    return (
        <div className="fellestur-form-container">
            <h1>Legg til fellestur</h1>
            <FellesturForm 
                onSubmitAction={handleOpprett} 
                buttonTekst="Lagre Fellestur" 
            />
        </div>
    );
}