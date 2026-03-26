//Håndterer rollebytte i varslingssystemet. Laget av Kay
export default function OppgaveRolleEndring({ varsel, loading, onBeslutning }) {
    const erBehandlet = varsel.status === 'behandlet' || varsel.status === 'avvist';
    // {varsel.status === 'godtatt' ? 'Du godtok denne forespørselen' : 'Du avslo denne forespørselen'}
    if (erBehandlet) {
        return (
            <p className="varsel-detaljer-behandlet">
               Behandlet
            </p>
        );
    }

    return (
        <div className="varsel-detaljer-handlinger">
            <button
                className="varsel-knapp varsel-knapp-godta"
                onClick={() => onBeslutning('godtatt', { melding: 'Rolleendring godtatt' })}
                disabled={loading}
            >
                Godta rolleendring
            </button>
            <button
                className="varsel-knapp varsel-knapp-avvis"
                onClick={() => onBeslutning('avvist', { melding: 'Rolleendring avvist' })}
                disabled={loading}
            >
                Avvis
            </button>
        </div>
    );
}
