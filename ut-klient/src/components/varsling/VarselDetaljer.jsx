import { formatNorskTid } from '../../utils/datoUtils';
import { toast } from 'react-toastify';
import OppgaveRolleEndring from './oppgaver/OppgaveRolleEndring';
import './VarselDetaljer.css';

const oppgaveTyper = {
    rolle_foresporsel: OppgaveRolleEndring,
};

//Viser innhold og eventuelle handlinger for et varsel. Laget av Kay
export default function VarselDetaljer({ varsel, loading, onBehandle }) {

    if (!varsel) {
        return (
            <div className="varsel-detaljer varsel-detaljer-tom">
                <p>Velg et varsel</p>
            </div>
        );
    }

    const OppgaveType = oppgaveTyper[varsel.type_navn];
    console.log(varsel)

    const handleBeslutning = async (beslutning, { melding } = {}) => {
        try {
            await onBehandle(varsel.varsel_id, beslutning);
            toast.success(melding ?? (beslutning === 'godtatt' ? 'Godtatt' : 'Avvist'));
        } catch {
            toast.error('Noe gikk galt');
        }
    };

    return (
        <div className="varsel-detaljer">
            <div className="varsel-detaljer-header">
                <h3 className="varsel-detaljer-tittel">{varsel.tittel}</h3>
                <span className="varsel-detaljer-tid">
                    {formatNorskTid(new Date(varsel.opprettet_tidspunkt))}
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
        </div>
    );
}
