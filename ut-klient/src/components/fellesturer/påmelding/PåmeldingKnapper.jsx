import { useState } from "react";
import { toast } from "react-toastify";
import { PÅMELDING_STATUS } from "../../../constants/konstanter";
import "./PåmeldingKnapper.css";
import { useTranslation } from "react-i18next";

//Viser påmeldingsknapper basert på brukerens påmeldings-status. Laget av Kay
export default function PåmeldingKnapper({
  aktivitetDatoId,
  minPåmelding,
  ledigePlasser,
  antallInteresserteDeltakere,
  loading,
  meldPå,
  meldAv,
  registrerBildesamtykke,
  erLastForPamelding = false,
}) {
  const { t } = useTranslation();
  const [visModal, setVisModal] = useState(false);

  const status = minPåmelding?.pamelding_status ?? null;
  const fullBooket = ledigePlasser !== null && ledigePlasser <= 0;

  if (!aktivitetDatoId) return <p className="påmelding-ingen-dato">{t("påmelding.velg_dato")}</p>;

  const handleMeldPå = async (nyStatus) => {
    try {
      await meldPå(aktivitetDatoId, nyStatus);
      toast.success(nyStatus === PÅMELDING_STATUS.BINDENDE ? t("påmelding.er_nå_påmeldt") : t("påmelding.er_interessert_toast"));
    } catch (err) {
      toast.error(err.message ?? t("påmelding.noe_gikk_galt"));
    }
  };

  const handleBindendeMeldPå = async (samtykker) => {
    setVisModal(false);
    await handleMeldPå(PÅMELDING_STATUS.BINDENDE);
    await registrerBildesamtykke(aktivitetDatoId, samtykker);
  };

  const handleMeldAv = async () => {
    try {
      await meldAv(aktivitetDatoId);
      toast.success(t("påmelding.er_meldt_av"));
    } catch {
      toast.error(t("påmelding.noe_gikk_galt"));
    }
  };

  return (
    <div className="påmelding-knapper">
      {ledigePlasser !== null && !erLastForPamelding && (
        <p className="ledige-plasser">{ledigePlasser > 0 ? t("påmelding.ledig_plass", { antall: ledigePlasser }) : t("påmelding.fullt")}</p>
      )}
      {antallInteresserteDeltakere > 0 && (
        <p className="interesserte-deltakere">{t("påmelding.interesserte", { antall: antallInteresserteDeltakere })}</p>
      )}

      {/*Ingen påmelding eller avmeldt*/}
      {(status === null || status === PÅMELDING_STATUS.AVMELDT) && (
        <>
          <button
            className="påmelding-btn interessert"
            onClick={() => handleMeldPå(PÅMELDING_STATUS.INTERESSERT)}
            disabled={loading || fullBooket || erLastForPamelding}
          >
            {t("påmelding.jeg_er_interessert")}
          </button>
          <button className="påmelding-btn bindende" onClick={() => setVisModal(true)} disabled={fullBooket || erLastForPamelding}>
            {t("påmelding.meld_meg_på")}
          </button>
        </>
      )}

      {/*Interessert*/}
      {status === PÅMELDING_STATUS.INTERESSERT && (
        <>
          <p className="påmelding-status interessert">{t("påmelding.du_er_interessert")}</p>
          <button className="påmelding-btn bindende" onClick={() => setVisModal(true)} disabled={fullBooket}>
            {t("påmelding.meld_meg_på")}
          </button>
          <button className="påmelding-btn avmeld" onClick={handleMeldAv} disabled={loading}>
            {t("påmelding.fjern_interesse")}
          </button>
        </>
      )}

      {/*Bindende*/}
      {status === PÅMELDING_STATUS.BINDENDE && (
        <>
          <p className="påmelding-status bindende">{t("påmelding.du_er_påmeldt")}</p>
        </>
      )}

      {/*Fristilt*/}
      {status === PÅMELDING_STATUS.FRISTILT && (
        <>
          <p className="påmelding-status fristilt">{t("påmelding.du_er_fristilt")}</p>
        </>
      )}

      {/*Bildesamtykke-modal*/}
      {visModal && (
        <div className="samtykke-overlay" onClick={() => setVisModal(false)}>
          <div className="samtykke-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="samtykke-tittel">{t("påmelding.bildesamtykke_tittel")}</h3>
            <p className="samtykke-tekst">{t("påmelding.bildesamtykke_tekst")}</p>
            <div className="samtykke-knapper">
              <button className="samtykke-btn bekreft" onClick={() => handleBindendeMeldPå(true)} disabled={loading}>
                {t("påmelding.jeg_samtykker")}
              </button>

              <button className="samtykke-btn uten-samtykke" onClick={() => handleBindendeMeldPå(false)} disabled={loading}>
                {t("påmelding.meld_på_uten_samtykke")}
              </button>

              <button className="samtykke-btn avbryt" onClick={() => setVisModal(false)}>
                {t("felles.avbryt")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
