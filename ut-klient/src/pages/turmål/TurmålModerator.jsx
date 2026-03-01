import LeggTilTurmål from "../../components/turmål/legg-til/LeggTilTurmål";
import RedigerTurmål from "../../components/turmål/rediger/RedigerTurmål";
import SlettTurmål from "../../components/turmål/slett/SlettTurmål";
//import { useTurmål } from "../hooks/useTurmål";
import PageWrapper from "../../components/PageWrapper";
//import { useTranslation } from "react-i18next";
import './TurmålModerator.css';

//Basert på HytteModerator.jsx. Laget av Kay og Olai
export default function TurmålModerator() {
    //const { refetch } = useTurmåler(true);
    //const { t } = useTranslation();

    return (
        <PageWrapper>
        <div className="TurmålModeratorPanel">
            <h1>Turmål</h1>
            <hr />
            <LeggTilTurmål />
            <hr />
            <RedigerTurmål />
            <hr />
            <SlettTurmål />

        </div>
        </PageWrapper>
    );
}

//Bug:
//bildeopplastning vil ikke fungere helt riktig dersom LeggTilTurmål og RedigerTurmål er på samme side. Dette er pga. hooken bruker 
//document.querySelector istedet for useRef .current