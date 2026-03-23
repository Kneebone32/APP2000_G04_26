import { useEffect, useState } from 'react';
import { useAutentisering } from '../hooks/useAutentisering';
import { useVarsler } from '../hooks/useVarsler';
import VarselListe from '../components/varsling/VarselListe';
import VarselDetaljer from '../components/varsling/VarselDetaljer';
import PageWrapper from '../components/PageWrapper';
import './Varsler.css';

const testVarsler = [
    { varsel_id: 2, tittel: 'Forespørsel om rolleendring', varsel_kategori: 'oppgave', status: 'ulest', opprettet_tid: '2026-03-23T09:00:00.000Z', innhold: 'Bruker Ola Nordmann (ola@example.com) har bedt om å bli annonsør.' },
];

//Varselside. Viser varsler og lar bruker behandle oppgaver. Laget av Kay
export default function Varsler() {
    const { token, erAutentisert } = useAutentisering({ autoFetch: true });
    const {
        varsler, valgtVarsel, setValgtVarsel, loading, error,
        hentVarsler, hentVarsel, merkSomLest, behandleOppgave,
        startPoll, stopPoll
    } = useVarsler({ token });

    const [valgtId, setValgtId] = useState(null);

    //Starter polling av varslerlisten
    useEffect(() => {
        if (!erAutentisert) return;
        startPoll(hentVarsler);
        return () => stopPoll();
    }, [erAutentisert, startPoll, stopPoll, hentVarsler]);

    const handleVelgVarsel = async (varsel) => {
        setValgtId(varsel.varsel_id);
        setValgtVarsel(varsel);
        await hentVarsel(varsel.varsel_id);
        if (varsel.status === 'ulest') {
            await merkSomLest(varsel.varsel_id);
        }
    };

    if (!erAutentisert) {
        return (
            <PageWrapper title="Varsler">
                <p>Du må være logget inn for å se varsler</p>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="varsler-side">
                <div className="varsler-layout">
                    <VarselListe
                        varsler={varsler.length > 0 ? varsler : testVarsler}
                        valgtId={valgtId}
                        onVelg={handleVelgVarsel}
                    />
                    <div className="varsler-innhold">
                        <VarselDetaljer
                            varsel={valgtVarsel}
                            loading={loading}
                            error={error}
                            onBehandle={behandleOppgave}
                        />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
