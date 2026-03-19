import { useState } from "react";
import { useAutentisering } from "../../../hooks/useAutentisering";
import { toast } from "react-toastify";

//Redigerer profil for innlogget bruker. Laget av Kay
export default function RedigerProfil() {
    const { bruker, redigerProfil, loading } = useAutentisering({autoFetch: true});

    if (loading) return null;
    return <ProfilForm bruker={bruker} redigerProfil={redigerProfil} />;
}

function ProfilForm({bruker, redigerProfil}) {
    const [navn, setNavn] = useState(bruker?.bruker_navn || "");
    const [etternavn, setEtternavn] = useState(bruker?.bruker_etternavn || "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //await redigerProfil(navn, etternavn);
            toast("Hvorfor skal du alltid teste ting som ikke er koblet til backend?!");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="rediger-profil">
            <h2>Rediger profil</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className="input">Navn
                        <input
                            type="text"
                            value={navn}
                            onChange={(e) => setNavn(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="input-container">
                    <label className="input">Etternavn
                        <input
                            type="text"
                            value={etternavn}
                            onChange={(e) => setEtternavn(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="input-container">
                    <label className="input">E-post
                        <input type="text" value={bruker?.bruker_epost || ""} disabled={true} />
                    </label>
                </div>
                <div className="input-container">
                    <button type="submit" className="lagre-btn">Lagre Endringer</button>
                </div>
            </form>
        </div>
    );
}