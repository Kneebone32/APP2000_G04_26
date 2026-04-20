import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useArtikkel } from "../../hooks/useArtikkel";
import { useModal } from "../../hooks/useModal";
import ArtikkelSøk from "./ArtikkelSøk";
import ConfirmModal from "../ConfirmModal";
import { toast } from "react-toastify";
import "../fellesturer/fellestur-form/FellesturForm.css";
import "./Artikkel.css";

//Sletter en artikkel. Laget av Kay
export default function SlettArtikkel() {
  const { t } = useTranslation();
  const { token } = useAutentisering({ autoFetch: false });
  const { artikler, slettArtikkel } = useArtikkel({ autoFetch: true, token });
  const { isOpen, open, close } = useModal();
  const [valgtId, setValgtId] = useState(null);

  const handleSlett = async () => {
    try {
      await slettArtikkel(valgtId);
      setValgtId(null);
      close();
      toast.success(t("artikkel.slettet"));
    } catch {
      toast.error(t("artikkel.feil_sletting"));
    }
  };

  const valgtTittel = artikler.find((a) => a.artikkel_id === valgtId)?.artikkel_tittel ?? "";

  return (
    <div className="fellestur-form-container">
      <h2>{t("artikkel.slett_tittel")}</h2>

      <ArtikkelSøk artikler={artikler} onSelect={(id) => setValgtId(id)} lagretTittel={valgtTittel} />

      <div className="input-container">
        <button className="artikkel-lagre-btn" onClick={open} disabled={!valgtId}>
          {t("artikkel.slett_tittel")}
        </button>
      </div>

      <ConfirmModal
        show={isOpen}
        onClose={close}
        onConfirm={handleSlett}
        tittel={t("artikkel.slett_tittel")}
        melding={t("artikkel.bekreft_sletting", { tittel: valgtTittel })}
        confirmText={t("felles.slett")}
      />
    </div>
  );
}
