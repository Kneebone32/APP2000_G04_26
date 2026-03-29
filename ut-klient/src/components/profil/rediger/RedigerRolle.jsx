import { useAutentisering } from "../../../hooks/useAutentisering";
import { toast } from "react-toastify";

//Lar innlogget bruker endre brukerrolle. Laget av Kay
export default function RedigerRolle() {
    const { loading, byttRolle, roller, mineRoller } = useAutentisering({ autoFetch: true });

    if (loading) return null;
    return <RolleForm mineRoller={mineRoller} roller={roller} byttRolle={byttRolle} />;
}

function RolleForm({mineRoller, roller, byttRolle}) {
    const mineRolleIder = mineRoller.map((rolle) => rolle.rolle_id);
    const tilgjengeligeRoller = roller.filter((rolle) => !mineRolleIder.includes(rolle.rolle_id));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const valgtRolleId = parseInt(e.target.rolle.value);
        try {
            await byttRolle(valgtRolleId);
            toast.success("Søknad sendt! En administrator vil behandle forespørselen din.");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="rediger-rolle">
            <h2>Endre brukerrolle</h2>
            <p>Nye roller må bli godkjent av en administrator. En søknad vil automatisk bli sendt</p>

            {/*Brukerens roller*/}
            {mineRoller.length > 0 && (
                <div className="mine-roller">
                    <p><strong>Dine roller:</strong> {mineRoller.map((r) => r.rolle_navn).join(", ")}</p>
                </div>
            )}

            {/*Søknad om ny rolle*/}
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className="input">Søk om ny rolle
                        <select name="rolle" defaultValue="">
                            <option value="" disabled>Velg rolle</option>
                            {tilgjengeligeRoller.map((rolle) => (
                                <option key={rolle.rolle_id} value={rolle.rolle_id}>{rolle.rolle_navn}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="input-container">
                    <button type="submit" className="lagre-btn" disabled={tilgjengeligeRoller.length === 0}>
                        Send søknad
                    </button>
                </div>
            </form>
        </div>
    );
}