import { useState } from "react";
import { useFellestur } from "../../../hooks/useFellesturer";
import { useModal } from "../../../hooks/useModal";
import FellesturSøk from "../FellesturSøk";
import { toast } from "react-toastify";
import ConfirmModal from "../../ConfirmModal";
import { useTranslation } from "react-i18next";
import "../fellestur-form/FellesturForm.css";

//Sletter Fellestur med valgt ID. Laget av Kay
//fellesturer-prop brukes av turleder for å begrense søk til egne turer
export default function SlettFellestur({ fellesturer: fellesturer_prop } = {}) {
  const { t } = useTranslation();
  const { isOpen, open, close } = useModal();
  const { fellesturer: fellesturer_alle, slettFellestur: deleteFellestur } = useFellestur({ autoFetch: !fellesturer_prop });
  const fellestur = fellesturer_prop ?? fellesturer_alle;
  const [valgtId, setValgtId] = useState(0);
  const [valgtTittel, setValgtTittel] = useState("");
  const [nullstillSøk, setNullstillSøk] = useState(0);

  const handleSelect = (id, tittel) => {
    setValgtId(id);
    setValgtTittel(tittel);
  };

  const handleSlett = async () => {
    if (valgtId === 0) {
      return toast.warn(t("fellesturer.velg_for_sletting"));
    }

    try {
      await deleteFellestur(valgtId);
      toast.success(`"${valgtTittel}${t("fellesturer.slettet")}`);
      close();
      setValgtId(0);
      setValgtTittel("");
      setNullstillSøk((k) => k + 1);
    } catch (err) {
      toast.error(t("fellesturer.feil_sletting") + err.message);
    }
  };

  return (
    <div className="fellestur-forum-container">
      <h2>{t("fellesturer.slett")}</h2>

      {/*Søkefelt til fellestur*/}
      <FellesturSøk key={nullstillSøk} fellesturer={fellestur} onSelect={handleSelect} lagretTittel={valgtTittel} />

      <div className="input-container">
        <button onClick={open} className="lagre-btn" disabled={valgtId === 0}>
          {t("fellesturer.slett")}
        </button>
      </div>

      {/*Modal til å bekrefte sletting*/}
      <ConfirmModal
        show={isOpen}
        onClose={close}
        onConfirm={handleSlett}
        tittel={t("fellesturer.slett").toLowerCase()}
        melding={`${t("fellesturer.bekreft_sletting")}${valgtTittel}"?`}
        confirmText={t("fellesturer.slett_tur")}
      />
    </div>
  );
}
