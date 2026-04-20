import { useState } from "react";
import Modal from "../../modal/Modal";
import { toast } from "react-toastify";
import "./Autentisering.css";
import { useTranslation } from "react-i18next";

//Registrerer en ny bruker med Modal. Laget av Kay
export default function RegisterBruker({ show, onClose, onByttTilLogginn, registrer, loading, error }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    bruker_navn: "",
    bruker_etternavn: "",
    bruker_epost: "",
    bruker_passord: "",
    bruker_passord_bekreft: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.bruker_passord !== formData.bruker_passord_bekreft) {
      toast.error(t("autentisering.passordene_ikke_like"));
      return;
    }

    try {
      await registrer(formData.bruker_navn, formData.bruker_etternavn, formData.bruker_epost.toLocaleLowerCase(), formData.bruker_passord);
      onClose();
      setFormData({
        bruker_navn: "",
        bruker_etternavn: "",
        bruker_epost: "",
        bruker_passord: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleBytt = () => {
    setFormData({
      bruker_navn: "",
      bruker_etternavn: "",
      bruker_epost: "",
      bruker_passord: "",
      bruker_passord_bekreft: "",
    });
    onByttTilLogginn();
  };

  return (
    <Modal show={show} onClose={onClose} title={t("autentisering.registrer_tittel")} size="sm">
      <div className="custom-modal-body">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-container">
            <label className="input">{t("autentisering.fornavn")}</label>
            <input type="text" name="bruker_navn" value={formData.bruker_navn} onChange={handleChange} required disabled={loading} />
          </div>

          <div className="input-container">
            <label className="input">{t("autentisering.etternavn")}</label>
            <input
              type="text"
              name="bruker_etternavn"
              value={formData.bruker_etternavn}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="input-container">
            <label className="input">{t("autentisering.epost")}</label>
            <input type="email" name="bruker_epost" value={formData.bruker_epost} onChange={handleChange} required disabled={loading} />
          </div>

          <div className="input-container">
            <label className="input">{t("autentisering.passord")}</label>
            <input
              type="password"
              name="bruker_passord"
              value={formData.bruker_passord}
              onChange={handleChange}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className="input-container">
            <label className="input">{t("autentisering.bekreft_passord")}</label>
            <input
              type="password"
              name="bruker_passord_bekreft"
              value={formData.bruker_passord_bekreft}
              onChange={handleChange}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          {error && <p className="error-melding">{error}</p>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? t("autentisering.registrerer") : t("autentisering.registrer_knapp")}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            {t("autentisering.har_konto")}{" "}
            <button type="button" onClick={handleBytt} className="auth-link-btn">
              {t("autentisering.logg_inn_link")}
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
