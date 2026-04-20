import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useFetchAnnonser } from "../../hooks/useFetchAnnonser";
import { useModal } from "../../hooks/useModal";
import ConfirmModal from "../ConfirmModal";

// Lar bruker søke opp en annonse og slette den etter bekreftelse. Laget av Olai.
export default function SlettAnnonse({ onSuccess }) {
  const { t } = useTranslation();
  const { token } = useAutentisering({ autoFetch: true });
  const { annonser, loadingAnnonser, slettAnnonse } = useFetchAnnonser({ autoFetch: true, token });
  const { isOpen, open, close } = useModal();
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const valgtAnnonse = annonser.find((a) => a.annonse_id === parseInt(selectedId));

  const handleSlett = async () => {
    if (!selectedId) return;

    try {
      await slettAnnonse(selectedId);
      toast.success(t("annonse.slettet", { tittel: valgtAnnonse?.tittel }));
      close();
      setSelectedId(null);
      setSearchTerm("");

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(t("annonse.feil_sletting") + ": " + err.message);
    }
  };

  // Filtrerer forslagene i datalisten basert på ID eller tittel.
  const filteredAnnonser = annonser.filter(
    (a) => a.annonse_id?.toString().includes(searchTerm) || a.tittel?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <h2>{t("annonse.slett_tittel")}</h2>
      <div>
        <label htmlFor="annonse-slett-search">{t("annonse.søk_og_velg")}</label>
        <input
          type="text"
          id="annonse-slett-search"
          list="annonser-slett-list"
          value={searchTerm}
          maxLength={50}
          onChange={(e) => {
            // Matcher fritekst mot datalist-verdi og setter valgt annonse-ID.
            setSearchTerm(e.target.value);
            const matchedAnnonse = annonser.find(
              (a) => `ID: ${a.annonse_id} - ${a.tittel}` === e.target.value || a.annonse_id?.toString() === e.target.value,
            );
            setSelectedId(matchedAnnonse ? matchedAnnonse.annonse_id.toString() : null);
          }}
          placeholder={t("annonse.søk_placeholder")}
        />
        <datalist id="annonser-slett-list">
          {filteredAnnonser.map((a) => (
            <option key={a.annonse_id} value={`ID: ${a.annonse_id} - ${a.tittel}`} />
          ))}
        </datalist>
      </div>

      {loadingAnnonser && <p>{t("annonse.laster")}</p>}

      <button onClick={open} disabled={!selectedId}>
        {t("annonse.slett_tittel")}
      </button>

      <ConfirmModal
        show={isOpen}
        onClose={close}
        onConfirm={handleSlett}
        tittel={t("annonse.slett_tittel")}
        melding={t("annonse.bekreft_sletting", { tittel: valgtAnnonse?.tittel })}
        confirmTekst={t("felles.slett")}
      />
    </div>
  );
}
