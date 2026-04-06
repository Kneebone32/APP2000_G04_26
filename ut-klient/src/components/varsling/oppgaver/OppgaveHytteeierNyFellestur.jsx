//Håndterer hytteeier-varsler for ny fellestur. Laget av Kay
export default function OppgaveHytteeierNyFellestur({ varsel, loading, onBeslutning }) {
    const erBehandlet = varsel.status === 'godtatt' || varsel.status === 'avvist';

    if (erBehandlet) {
        return (
            <p className="varsel-detaljer-behandlet">
                {varsel.status === 'godtatt' ? 'Du bekreftet at du har plass' : 'Du meldte at du ikke har plass'}
            </p>
        );
    }

    return (
        <div className="varsel-detaljer-handlinger">
            <button
                className="varsel-knapp varsel-knapp-godta"
                onClick={() => onBeslutning('godtatt', { melding: 'Bekreftet – hyttebestillinger kan forekomme' })}
                disabled={loading}
            >
                Jeg har plass
            </button>
            <button
                className="varsel-knapp varsel-knapp-avvis"
                onClick={() => onBeslutning('avvist', { melding: 'Avslått – hyttebestillinger vil ikke forekomme' })}
                disabled={loading}
            >
                Jeg har ikke plass
            </button>
        </div>
    );
}
