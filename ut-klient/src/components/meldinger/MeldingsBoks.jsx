import { useState, useEffect, useRef } from 'react';
import { formatMeldingTid } from '../../utils/datoUtils';
import './MeldingsBoks.css';
import { toast } from 'react-toastify';

//Chat-box for en samtale (PM eller gruppe). Laget av Kay
export default function MeldingsBoks({ meldinger, loading, error, brukerId, onSend, tittel }) {
    const [innhold, setInnhold] = useState('');
    const bunnRef = useRef(null);

    //scroller automatisk til bunn når nye meldinger kommer inn
    useEffect(() => {
        bunnRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [meldinger]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!innhold.trim()) return;
        try {
            await onSend(innhold.trim());
            setInnhold('');
        } catch {
            toast.error("Noe gikk galt ved sending av melding");
        }
    };

    return (
        <div className="meldingsboks">
            {tittel && <div className="meldingsboks-header"><h3>{tittel}</h3></div>}

            {/*Meldingsboksen*/}
            <div className="meldingsboks-liste">
                {error && <p className="meldingsboks-feil">{error}</p>}
                {!loading && meldinger.length === 0 && (
                    <p className="meldingsboks-status">Ingen meldinger</p>
                )}

                {/*individuell meldingsboble*/}
                {meldinger.map((melding) => {
                    const erMinMelding = melding.fra_bruker === brukerId;
                    return (
                        <div
                            key={melding.melding_id}
                            className={`melding-boble ${erMinMelding ? 'melding-min' : 'melding-andres'}`}
                        >
                            {!erMinMelding && (
                                <span className="melding-avsender">{melding.avsender_navn}</span>
                            )}
                            <p className="melding-innhold">{melding.melding_tekst}</p>
                            <span className="melding-tid">
                                {formatMeldingTid(melding.sendt_datetime)}
                            </span>
                        </div>
                    );
                })}
                <div ref={bunnRef} />
            </div>

            {/*Form for å sende melding*/}
            <form className="meldingsboks-input" onSubmit={handleSend}>
                <input
                    type="text"
                    value={innhold}
                    onChange={(e) => setInnhold(e.target.value)}
                    placeholder="Skriv en melding"
                    
                />
                <button type="submit" disabled={!innhold.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
}
