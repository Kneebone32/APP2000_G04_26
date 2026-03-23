import { formatNorskTid } from '../../utils/datoUtils';
import { toast } from 'react-toastify';
import './VarselDetaljer.css';

//Viser innhold og eventuelle handlinger for et varsel. Laget av Kay
export default function VarselDetaljer({varsel, loading, onBehandle}) {

    if (!varsel) {
        return (
            <div className="varsel-detaljer varsel-detaljer-tom">
                <p>Velg et varsel</p>
            </div>
        );
    }

    const erOppgave = varsel.varsel_kategori === 'oppgave';
    const erBehandlet = varsel.status === 'godtatt' || varsel.status === 'avvist';

    const handleBeslutning = async (beslutning) => {
        try {
            await onBehandle(varsel.varsel_id, beslutning);
            toast.success(beslutning === 'godtatt' ? 'Godtatt' : 'Avvist');
        } catch {
            toast.error('Noe gikk galt');
        }
    };

    return (
        <div className="varsel-detaljer">
            <div className="varsel-detaljer-header">
                <h3 className="varsel-detaljer-tittel">{varsel.tittel}</h3>
                <span className="varsel-detaljer-tid">
                    {formatNorskTid(new Date(varsel.opprettet_tid))}
                </span>
            </div>
            <p className="varsel-detaljer-innhold">{varsel.innhold}</p>

            {/*Handlingsknapper hvis varsel er en oppgave*/}
            {/*For nå vil denne kun fungere på rolle-bytte. Trenger en ny fil til alle oppgaver*/}
            {erOppgave && (
                <div className="varsel-detaljer-handlinger">
                    {erBehandlet ? (
                        <p className="varsel-detaljer-behandlet">
                            {varsel.status === 'godtatt' ? 'Du godtok denne forespørselen' : 'Du avslo denne forespørselen'}
                        </p>
                    ) : (
                        <>
                            <button
                                className="varsel-knapp varsel-knapp-godta"
                                onClick={() => handleBeslutning('godtatt')}
                                disabled={loading}
                            >
                                Godta
                            </button>
                            <button
                                className="varsel-knapp varsel-knapp-avvis"
                                onClick={() => handleBeslutning('avvist')}
                                disabled={loading}
                            >
                                Avvis
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
