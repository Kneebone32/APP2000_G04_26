import { FORESPØRSEL_STATUS } from "../../../constants/konstanter";
import { useTranslation } from "react-i18next";

//Håndterer rollebytte i varslingssystemet. Laget av Kay
export default function OppgaveRolleEndring({ varsel, loading, onBeslutning }) {
  const { t } = useTranslation();
  const erBehandlet = varsel.foresporsel_status === FORESPØRSEL_STATUS.GODKJENT || varsel.foresporsel_status === FORESPØRSEL_STATUS.AVSLÅTT;

  if (erBehandlet) {
    return (
      <p className="varsel-detaljer-behandlet">
        {varsel.foresporsel_status === FORESPØRSEL_STATUS.GODKJENT ? t("varsling.godtok_forespørsel") : t("varsling.avslo_forespørsel")}
      </p>
    );
  }

  return (
    <>
      {varsel && !loading && (
        <div className="varsel-detaljer-handlinger">
          <button
            className="varsel-knapp varsel-knapp-godta"
            onClick={() => onBeslutning(true, { melding: t("varsling.rolleendring_godtatt") })}
            disabled={loading}
          >
            {t("varsling.godta_rolleendring")}
          </button>
          <button
            className="varsel-knapp varsel-knapp-avvis"
            onClick={() => onBeslutning(false, { melding: t("varsling.rolleendring_avvist") })}
            disabled={loading}
          >
            {t("varsling.avvis")}
          </button>
        </div>
      )}
    </>
  );
}
