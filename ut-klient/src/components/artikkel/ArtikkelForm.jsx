import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { useModal } from "../../hooks/useModal";
import Modal from "../../modal/Modal";
import "./Artikkel.css";
import "./modal/ArtikkelModal.css";
import "../fellesturer/fellestur-form/FellesturForm.css";

//Gjenbrukbart form til Artikkel. Laget av Kay
export default function ArtikkelForm({ tittel, onTittelChange, innhold, onInnholdChange, onLagre, loading, buttonTekst }) {
  const { t } = useTranslation();
  const { isOpen, open, close } = useModal();
  return (
    <>
      <div className="input-container">
        <label className="input">
          {t("felles.tittel")}
          <input type="text" value={tittel} onChange={(e) => onTittelChange(e.target.value)} />
        </label>
      </div>

      <div className="input-container">
        <div className="artikkel-editor-faner">
          <button type="button" onClick={open}>
            {t("artikkel.forhåndsvisning")}
          </button>
        </div>

        <textarea
          className="artikkel-textarea"
          value={innhold}
          onChange={(e) => onInnholdChange(e.target.value)}
          placeholder={t("artikkel.innhold_placeholder")}
          rows={20}
        />
      </div>

      <Modal show={isOpen} onClose={close} title={tittel} size="lg">
        <div className="artikkel-modal-innhold">
          <ReactMarkdown>{innhold}</ReactMarkdown>
        </div>
      </Modal>

      <button className="artikkel-lagre-btn" onClick={onLagre} disabled={loading}>
        {buttonTekst || t("artikkel.lagre_knapp")}
      </button>
    </>
  );
}
