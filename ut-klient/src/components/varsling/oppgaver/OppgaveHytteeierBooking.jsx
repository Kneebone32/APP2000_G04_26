import {FORESPØRSEL_STATUS} from "../../../constants/konstanter";
import { useTranslation } from "react-i18next";

//Håndterer hytteeier-bekreftelse/avslag på booking. Laget av Kay
export default function OppgaveHytteeierBooking({varsel, loading, onBeslutning}) {
    const { t } = useTranslation();
    const erBehandlet = varsel.foresporsel_status === FORESPØRSEL_STATUS.GODKJENT || varsel.foresporsel_status === FORESPØRSEL_STATUS.AVSLÅTT || varsel.status === 'behandlet'

    if (erBehandlet) {
        return (
            <p className="varsel-detaljer-behandlet">
                {varsel.foresporsel_status === FORESPØRSEL_STATUS.GODKJENT ? t("varsling.bekreftet_booking") : t("varsling.avslo_booking")}
            </p>
        );
    }

    return (
        <div className="varsel-detaljer-handlinger">
            <button
                className="varsel-knapp varsel-knapp-godta"
                onClick={() => onBeslutning(true, {melding: t("varsling.booking_bekreftet")})}
                disabled={loading}
            >
                {t("varsling.bekreft_booking")}
            </button>
            <button
                className="varsel-knapp varsel-knapp-avvis"
                onClick={() => onBeslutning(false, {melding: t("varsling.booking_avslatt")})}
                disabled={loading}
            >
                {t("varsling.avslå_booking")}
            </button>
        </div>
    );
}
