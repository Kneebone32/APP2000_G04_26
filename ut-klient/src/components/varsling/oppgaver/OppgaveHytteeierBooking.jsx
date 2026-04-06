//Håndterer hytteeier-bekreftelse/avslag på booking. Laget av Kay
export default function OppgaveHytteeierBooking({varsel, loading, onBeslutning}) {
    const erBehandlet = varsel.status === 'godtatt' || varsel.status === 'avvist';

    if (erBehandlet) {
        return (
            <p className="varsel-detaljer-behandlet">
                {varsel.status === 'godtatt' ? 'Du bekreftet bookingen' : 'Du avslo bookingen'}
            </p>
        );
    }

    return (
        <div className="varsel-detaljer-handlinger">
            <button
                className="varsel-knapp varsel-knapp-godta"
                onClick={() => onBeslutning('godtatt', {melding: 'Booking bekreftet'})}
                disabled={loading}
            >
                Bekreft booking
            </button>
            <button
                className="varsel-knapp varsel-knapp-avvis"
                onClick={() => onBeslutning('avvist', {melding: 'Booking avslått'})}
                disabled={loading}
            >
                Avslå booking
            </button>
        </div>
    );
}
