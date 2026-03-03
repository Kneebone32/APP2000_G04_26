import LeggTilFellestur from "../../components/fellesturer/legg-til/LeggTilFellestur";
import RedigerFellestur from "../../components/fellesturer/rediger/RedigerFellestur";
import SlettFellestur from "../../components/fellesturer/slett/SlettFellestur";
import FellesturKobling from "../../components/fellesturer/fellestur-kobling/FellesturKobling";
//import { useFellesturer } from "../hooks/useFellesturer";
import PageWrapper from "../../components/PageWrapper";
import { useTranslation } from "react-i18next";
import './FellesturModerator.css';

//Basert på HytteModerator.jsx. Laget av Kay og Olai
export default function FellesturModerator() {
    //const { refetch } = useFellesturer(true);
    const { t } = useTranslation();

    return (
        <PageWrapper>
        <div className="FellesturModeratorPanel">
            <h1>{t("fellesturer.moderator")}</h1>
            <hr />
            <LeggTilFellestur />
            <hr />
            <FellesturKobling />
            <hr />
            <RedigerFellestur />
            <hr />
            <SlettFellestur />
        </div>
        </PageWrapper>
    );
}

//Bug:
//bildeopplastning vil ikke fungere helt riktig dersom LeggTilFellestur og RedigerFellesTur er på samme side. Dette er pga. hooken bruker 
//document.querySelector istedet for useRef .current