import { useState } from "react";
import { useFellestur } from "../../../hooks/useFellesturer";
import { usePåmelding } from "../../../hooks/usePåmelding";
import { useModal } from "../../../hooks/useModal";
import { useAutentisering } from "../../../hooks/useAutentisering";
import FellesturSøk from "../FellesturSøk";
import { formatNorskdato } from "../../../utils/datoUtils";
import { VærvarselDagDetaljert, VærvarslingUke } from "../../Værvarsling";
import Modal from "../../../modal/Modal";
import { toast } from "react-toastify";
import "./LåsDato.css";
import { useTranslation } from "react-i18next";

//Låser en dato for en fellestur. Laget av Kay
//fellesturer-prop brukes av turleder for å begrense søk til egne turer
export default function LåsDato({ fellesturer: fellesturer_prop } = {}) {
  const { t } = useTranslation();
  const { token } = useAutentisering({ autoFetch: false });
  const { fellesturer: fellesturer_alle, hentFellesturFraId } = useFellestur({ autoFetch: !fellesturer_prop });
  const { velgFastDato } = usePåmelding({ token });
  const { isOpen: værvarselÅpen, open: åpneVærvarsel, close: lukkVærvarsel } = useModal();
  const [valgtData, setValgtData] = useState(null);
  const [lasterFellestur, setLasterFellestur] = useState(false);
  const [valgtDato, setValgtDato] = useState(null);
  const [laster, setLaster] = useState(false);
  const fellesturer = fellesturer_prop ?? fellesturer_alle;

  const handleSøkSelect = async (id) => {
    if (!id) {
      setValgtData(null);
      setValgtDato(null);
      return;
    }

    setLasterFellestur(true);
    try {
      const data = await hentFellesturFraId(id);
      setValgtData(data);
      setValgtDato(null);
    } catch (err) {
      toast.error(t("låsdato.feil_hente") + err.message);
      setValgtData(null);
    } finally {
      setLasterFellestur(false);
    }
  };

  const handleLåsDato = async () => {
    if (!valgtDato) return;
    setLaster(true);
    try {
      await velgFastDato(valgtDato.aktivitet_dato_id);
      toast.success(`${t("låsdato.dato_låst")}: ${formatNorskdato(new Date(valgtDato.aktivitet_slutt_dato))}`);
      setValgtData(null);
      setValgtDato(null);
    } catch (err) {
      toast.error(t("låsdato.feil_lås_dato") + err.message);
    } finally {
      setLaster(false);
    }
  };

  const datoer = valgtData?.datoer;
  const breddegrad = valgtData?.stier?.[0]?.sti_punkter?.[0].breddegrad;
  const lengdegrad = valgtData?.stier?.[0]?.sti_punkter?.[0].lengdegrad;

  return (
    <div className="fellestur-form-container">
      <h2>{t("låsdato.tittel")}</h2>

      {/*Søkefelt til fellestur*/}
      <FellesturSøk fellesturer={fellesturer} onSelect={handleSøkSelect} lagretTittel={valgtData?.aktivitet_tittel ?? ""} />

      {!lasterFellestur && valgtData && datoer.length > 0 && (
        <>
          {datoer.length === 1 ? (
            <p>{t("låsdato.dato_allerede_valgt")}</p>
          ) : (
            <>
              {/*8 dagers værvarsel*/}
              {breddegrad && lengdegrad && (
                <button type="button" className="værvarsel-langtids" onClick={åpneVærvarsel}>
                  {t("fellestur_form.værvarsel_8_dager")}
                </button>
              )}
              {/*Datoliste med alle startdatoer*/}
              <div className="låsdato-container">
                <ul className="låsdato-liste">
                  {datoer.map((dato, index) => {
                    const datoVerdi = dato.aktivitet_start_dato;
                    const erMarkert = valgtDato === dato;
                    return (
                      <li key={index}>
                        <label className="låsdato-label">
                          <input type="radio" name="lås-dato" checked={erMarkert} onChange={() => setValgtDato(dato)} />
                          {formatNorskdato(new Date(datoVerdi))}
                        </label>
                        {breddegrad && lengdegrad && <VærvarselDagDetaljert lat={breddegrad} lon={lengdegrad} dato={new Date(datoVerdi)} />}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}

          {/*Låsdato-knapp*/}
          {valgtDato && (
            <button type="button" onClick={handleLåsDato} disabled={laster}>
              {t("låsdato.lås_dato")}
            </button>
          )}
        </>
      )}

      {!lasterFellestur && !valgtData && <p>{t("låsdato.velg_fellestur")}</p>}

      <Modal show={værvarselÅpen} onClose={lukkVærvarsel} title={t("fellestur_form.værvarsel")} size="lg">
        <div className="modal-weather-container">
          {breddegrad && lengdegrad && <VærvarslingUke latitude={breddegrad} longitude={lengdegrad} />}
        </div>
      </Modal>
    </div>
  );
}
