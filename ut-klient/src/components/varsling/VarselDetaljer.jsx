import { formatMeldingTid } from '../../utils/datoUtils';
import { toast } from 'react-toastify';
import OppgaveRolleEndring from './oppgaver/OppgaveRolleEndring';
import OppgaveHytteeierNyFellestur from './oppgaver/OppgaveHytteeierNyFellestur';
import OppgaveHytteeierBooking from './oppgaver/OppgaveHytteeierBooking';
import OppgaveAnnonseForespørsel from './oppgaver/OppgaveAnnonseForespørsel';
import './VarselDetaljer.css';
import { useTranslation } from 'react-i18next';

const oppgaveTyper = {
    rolle_foresporsel: OppgaveRolleEndring,
    hytteeier_ny_fellestur: OppgaveHytteeierNyFellestur,
    hytteeier_booking_sendt: OppgaveHytteeierBooking,
    annonse_foresporsel: OppgaveAnnonseForespørsel

};

//Viser innhold og eventuelle handlinger for et varsel. Laget av Kay
export default function VarselDetaljer({ varsel, loading, onBehandle, onSlett }) {
    const { t } = useTranslation();

    if (!varsel) {
        return (
            <div className="varsel-detaljer varsel-detaljer-tom">
                <p>{t("varsling.velg_varsel")}</p>
            </div>
        );
    }

    const OppgaveType = oppgaveTyper[varsel.type_navn];

    const handleBeslutning = async (beslutning, { melding } = {}) => {
        try {
            await onBehandle(varsel.varsel_id, beslutning);
            toast.success(melding ?? (beslutning ? t("varsling.godtatt") : t("varsling.avvist")));
        } catch {
            toast.error(t("varsling.noe_gikk_galt"));
        }
    };

    return (
        <div className="varsel-detaljer">
            <div className="varsel-detaljer-header">
                <h3 className="varsel-detaljer-tittel">{varsel.tittel}</h3>
                <span className="varsel-detaljer-tid">
                    {formatMeldingTid(varsel.opprettet_tidspunkt)}
                </span>
            </div>
            <p className="varsel-detaljer-innhold">{varsel.innhold}</p>

            {OppgaveType && (
                <OppgaveType
                    varsel={varsel}
                    loading={loading}
                    onBeslutning={handleBeslutning}
                />
            )}

            <button
                className="varsel-knapp varsel-knapp-slett"
                onClick={() => onSlett(varsel.varsel_id)}
                disabled={loading}
            >
                {t("varsling.slett_varsel")}
            </button>
        </div>
    );
}
