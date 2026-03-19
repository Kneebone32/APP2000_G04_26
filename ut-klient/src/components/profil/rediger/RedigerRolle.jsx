import { useAutentisering } from "../../../hooks/useAutentisering";
import { toast } from "react-toastify";

const BRUKERROLLER = [
    { rolle_id: 1, rolle_navn: "Hytteeier" },
    { rolle_id: 2, rolle_navn: "Turleder" },
];

//Lar innlogget bruker endre brukerrolle. Laget av Kay
export default function RedigerRolle() {
    const { bruker, loading, byttRolle } = useAutentisering({ autoFetch: true });

    if (loading) return null;
    return <RolleForm bruker={bruker} byttRolle={byttRolle} />;
}

function RolleForm({bruker, byttRolle}) {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const valgtRolleId = parseInt(e.target.rolle.value);
        try {
            //await byttRolle(valgtRolleId);
            toast.success("nei");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="rediger-rolle">
            <h2>Endre brukerrolle</h2>
            <p>Rollebytter må bli godkjent av en administrator. Ved lagring av ny rolle vil en søknad automatisk ble sendt</p>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className="input">Brukerrolle
                        <select name="rolle" defaultValue={bruker?.rolle_id || ""}>
                            {BRUKERROLLER.map((rolle) => (
                                <option key={rolle.rolle_id} value={rolle.rolle_id}>{rolle.rolle_navn}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="input-container">
                    <button type="submit" className="lagre-btn">Lagre rolle</button>
                </div>
            </form>
        </div>
    );
}