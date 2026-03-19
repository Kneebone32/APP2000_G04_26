import { useState } from "react";
import { useAutentisering } from "../../../hooks/useAutentisering";
import { toast } from "react-toastify";

//Lar innlogget bruker bytte passord. Laget av Kay
export default function RedigerPassord() {
    const { byttPassord } = useAutentisering({ autoFetch: false });
    const [gammeltPassord, setGammeltPassord] = useState("");
    const [nyttPassord, setNyttPassord] = useState("");
    const [bekreftPassord, setBekreftPassord] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nyttPassord !== bekreftPassord) {
            toast.error("Passordene er ikke like");
            return;
        }

        try {
            //await byttPassord(gammeltPassord, nyttPassord);
            toast.success("Passord oppdatert. Eller er ble det oppdatert?");
            setGammeltPassord("");
            setNyttPassord("");
            setBekreftPassord("");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="rediger-passord">
            <h2>Bytt passord</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className="input">Nåværende passord
                        <input
                            type="password"
                            value={gammeltPassord}
                            onChange={(e) => setGammeltPassord(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="input-container">
                    <label className="input">Nytt passord
                        <input
                            type="password"
                            value={nyttPassord}
                            onChange={(e) => setNyttPassord(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="input-container">
                    <label className="input">Bekreft nytt passord
                        <input
                            type="password"
                            value={bekreftPassord}
                            onChange={(e) => setBekreftPassord(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="input-container">
                    <button type="submit" className="lagre-btn">Bytt passord</button>
                </div>
            </form>
        </div>
    );
}