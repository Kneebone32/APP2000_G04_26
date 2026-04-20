import { useState } from "react";
import { useAutentisering } from "../../../hooks/useAutentisering";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

//Lar innlogget bruker bytte passord. Laget av Kay
export default function RedigerPassord() {
  const { t } = useTranslation();
  const { byttPassord } = useAutentisering({ autoFetch: false });
  const [gammeltPassord, setGammeltPassord] = useState("");
  const [nyttPassord, setNyttPassord] = useState("");
  const [bekreftPassord, setBekreftPassord] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nyttPassord !== bekreftPassord) {
      toast.error(t("autentisering.passordene_ikke_like"));
      return;
    }

    try {
      await byttPassord(gammeltPassord, nyttPassord);
      toast.success(t("profil.passord_oppdatert"));
      setGammeltPassord("");
      setNyttPassord("");
      setBekreftPassord("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="rediger-passord">
      <h2>{t("profil.bytt_passord_tittel")}</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label className="input">
            {t("profil.navarende_passord")}
            <input type="password" value={gammeltPassord} onChange={(e) => setGammeltPassord(e.target.value)} required />
          </label>
        </div>
        <div className="input-container">
          <label className="input">
            {t("profil.nytt_passord")}
            <input type="password" value={nyttPassord} onChange={(e) => setNyttPassord(e.target.value)} required />
          </label>
        </div>
        <div className="input-container">
          <label className="input">
            {t("profil.bekreft_nytt_passord")}
            <input type="password" value={bekreftPassord} onChange={(e) => setBekreftPassord(e.target.value)} required />
          </label>
        </div>
        <div className="input-container">
          <button type="submit" className="lagre-btn">
            {t("profil.bytt_passord_knapp")}
          </button>
        </div>
      </form>
    </div>
  );
}
