import { useState } from "react";
import { useFellestur } from "../../../hooks/useFellesturer";
import { usePåmelding } from "../../../hooks/usePåmelding";
import { useAutentisering } from "../../../hooks/useAutentisering";
import { useModal } from "../../../hooks/useModal";
import FellesturSøk from "../FellesturSøk";
import ConfirmModal from "../../ConfirmModal";
import { DATO_STATUS } from "../../../constants/konstanter";
import { toast } from "react-toastify";
import "../lås-dato/LåsDato.css";
import { useTranslation } from "react-i18next";

//Låser påmelding for en fellestur. Laget av Kay
//fellesturer-prop brukes av turleder for å begrense søk til egne turer
export default function LåsFellestur({ fellesturer: fellesturer_prop } = {}) {
  const { t } = useTranslation();
  const { token } = useAutentisering({ autoFetch: false });
  const { fellesturer: fellesturer_alle, hentFellesturFraId } = useFellestur({ autoFetch: !fellesturer_prop });
  const { låsPåmelding } = usePåmelding({ token });
  const [valgtData, setValgtData] = useState(null);
  const [erLåst, setErLåst] = useState(false);
  const [lasterFellestur, setLasterFellestur] = useState(false);
  const [laster, setLaster] = useState(false);
  const { isOpen: visBekreft, open: åpneBekreft, close: lukkBekreft } = useModal();
  const fellesturer = fellesturer_prop ?? fellesturer_alle;

  const handleSøkSelect = async (id) => {
    if (!id) {
      setValgtData(null);
      setErLåst(false);
      return;
    }
    setLasterFellestur(true);
    try {
      const data = await hentFellesturFraId(id);
      setValgtData(data);
      setErLåst(data?.datoer[0]?.er_last_for_pamelding ?? false);
    } catch (err) {
      toast.error(t("låsfellestur.feil_hente") + err.message);
      setValgtData(null);
    } finally {
      setLasterFellestur(false);
    }
  };

  const handleLåsFellestur = async () => {
    if (!valgtData) return;
    setLaster(true);
    try {
      await låsPåmelding(valgtData.aktivitet_id, true);
      setErLåst(true);
      toast.success(t("låsfellestur.påmelding_låst"));
    } catch (err) {
      toast.error(t("låsfellestur.feil_lås") + err.message);
    } finally {
      setLaster(false);
    }
  };

  return (
    <div className="fellestur-form-container">
      <h2>{t("låsfellestur.tittel")}</h2>

      <FellesturSøk fellesturer={fellesturer} onSelect={handleSøkSelect} lagretTittel={valgtData?.aktivitet_tittel ?? ""} />

      {/*Startdato må være valgt før bruker kan låse fellestur*/}
      {!lasterFellestur && valgtData && (
        <>
          <p>
            <strong>{t("låsfellestur.status_fellestur")}</strong> {valgtData.aktivitet_tittel}
          </p>
          {valgtData.datoer?.some((d) => d.aktivitet_dato_status === DATO_STATUS.FORESLATT) ? (
            <p>{t("låsfellestur.lås_dato_først")}</p>
          ) : erLåst ? (
            <p>
              <strong>{t("låsfellestur.status_fellestur")}</strong> {t("låsfellestur.påmelding_stengt")}
            </p>
          ) : (
            <button type="button" onClick={åpneBekreft} disabled={laster}>
              {t("låsfellestur.steng_påmelding")}
            </button>
          )}
        </>
      )}

      {!lasterFellestur && !valgtData && <p>{t("låsfellestur.velg_fellestur")}</p>}

      <ConfirmModal
        show={visBekreft}
        onClose={lukkBekreft}
        onConfirm={() => {
          lukkBekreft();
          handleLåsFellestur();
        }}
        tittel={t("låsfellestur.steng_påmelding")}
        melding={t("låsfellestur.bekreft_melding", { tittel: valgtData?.aktivitet_tittel })}
        confirmTekst={t("låsfellestur.steng")}
        knappFarge="blå"
      />
    </div>
  );
}
