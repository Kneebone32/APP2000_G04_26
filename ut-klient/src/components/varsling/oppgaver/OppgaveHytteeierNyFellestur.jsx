import { FORESPØRSEL_STATUS } from "../../../constants/konstanter";
import { useTranslation } from "react-i18next";

//Håndterer hytteeier-varsler for ny fellestur. Laget av Kay
export default function OppgaveHytteeierNyFellestur({ varsel, loading, onBeslutning }) {
  const { t } = useTranslation();
  const erBehandlet = varsel.status === "behandlet";

  if (erBehandlet) {
    return (
      <div className="varsel-detaljer-behandlet">
        {varsel.foresporsel_status === FORESPØRSEL_STATUS.GODKJENT ? t("varsling.bekreftet_plass") : t("varsling.meldt_ikke_plass")}
        {varsel.foresporsel_status === FORESPØRSEL_STATUS.GODKJENT && (
          <button
            className="varsel-knapp varsel-knapp-avvis"
            onClick={() => onBeslutning(false, { melding: t("varsling.avslatt_hyttebestilling") })}
            disabled={loading}
            style={{ margin: "1rem " }}
          >
            {t("varsling.trekk_bekreftelse")}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="varsel-detaljer-handlinger">
      <button
        className="varsel-knapp varsel-knapp-godta"
        onClick={() => onBeslutning(true, { melding: t("varsling.bekreftet_hyttebestilling") })}
        disabled={loading}
      >
        {t("varsling.jeg_har_plass")}
      </button>
      <button
        className="varsel-knapp varsel-knapp-avvis"
        onClick={() => onBeslutning(false, { melding: t("varsling.avslatt_hyttebestilling") })}
        disabled={loading}
      >
        {t("varsling.jeg_har_ikke_plass")}
      </button>
    </div>
  );
}
