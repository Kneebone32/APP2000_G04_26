import { useState } from "react";
import Modal from "../../modal/Modal";
import "./Autentisering.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

//Håndterer brukerinnlogging med Modal. Laget av Kay
export default function Logginn({ show, onClose, onByttTilRegistrer, logginn, loading, error }) {
  const { t } = useTranslation();
  const [epost, setEpost] = useState("");
  const [passord, setPassord] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const innloggetBruker = await logginn(epost, passord);
      onClose();
      setEpost("");
      setPassord("");
      toast.success(t("autentisering.velkommen_tilbake", { navn: innloggetBruker.bruker.bruker_navn }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleBytt = () => {
    setEpost("");
    setPassord("");
    onByttTilRegistrer();
  };

  return (
    <Modal show={show} onClose={onClose} title={t("autentisering.logg_inn_tittel")} size="sm">
      <div className="custom-modal-body">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-container">
            <label className="input">{t("autentisering.epost")}</label>
            <input className="input" type="email" value={epost} onChange={(e) => setEpost(e.target.value)} required disabled={loading} />
          </div>

          <div className="input-container">
            <label className="input">{t("autentisering.passord")}</label>

            <input type="password" value={passord} onChange={(e) => setPassord(e.target.value)} required disabled={loading} />
          </div>

          {error && <p className="error-melding">{error}</p>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? t("autentisering.logger_inn") : t("autentisering.logg_inn_knapp")}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            {t("autentisering.ingen_konto")}{" "}
            <button type="button" onClick={handleBytt} className="auth-link-btn">
              {t("autentisering.registrer")}
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
