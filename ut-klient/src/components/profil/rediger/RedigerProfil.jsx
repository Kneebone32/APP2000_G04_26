import { useState } from "react";
import { useAutentisering } from "../../../hooks/useAutentisering";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

//Redigerer profil for innlogget bruker. Laget av Kay
export default function RedigerProfil() {
    const { bruker, redigerProfil, loading } = useAutentisering({autoFetch: true});

    if (loading) return null;
    return <ProfilForm bruker={bruker} redigerProfil={redigerProfil} />;
}

function ProfilForm({bruker, redigerProfil}) {
    const { t } = useTranslation();
    const [navn, setNavn] = useState(bruker?.bruker_navn || "");
    const [etternavn, setEtternavn] = useState(bruker?.bruker_etternavn || "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await redigerProfil(navn, etternavn);
            toast.success(t("profil.oppdatert"));
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="rediger-profil">
            <h2>{t("profil.rediger_tittel")}</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label className="input">{t("felles.navn")}
                        <input
                            type="text"
                            value={navn}
                            onChange={(e) => setNavn(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="input-container">
                    <label className="input">{t("autentisering.etternavn")}
                        <input
                            type="text"
                            value={etternavn}
                            onChange={(e) => setEtternavn(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="input-container">
                    <label className="input">{t("autentisering.epost")}
                        <input type="text" value={bruker?.bruker_epost || ""} disabled={true} />
                    </label>
                </div>
                <div className="input-container">
                    <button type="submit" className="lagre-btn">{t("profil.lagre_endringer")}</button>
                </div>
            </form>
        </div>
    );
}