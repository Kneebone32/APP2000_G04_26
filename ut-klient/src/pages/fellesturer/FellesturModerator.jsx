import LeggTilFellestur from "../../components/fellesturer/legg-til/LeggTilFellestur";
import RedigerFellestur from "../../components/fellesturer/rediger/RedigerFellestur";
import SlettFellestur from "../../components/fellesturer/slett/SlettFellestur";
//import { useFellesturer } from "../hooks/useFellesturer";
import PageWrapper from "../../components/PageWrapper";
//import { useTranslation } from "react-i18next";
import './FellesturModerator.css';

export default function FellesturModerator() {
    //const { refetch } = useFellesturer(true);
    //const { t } = useTranslation();


    return (
        <PageWrapper>
        <div className="FellesturModeratorPanel">
            <h1>Fellestur</h1>
            <hr />

            <LeggTilFellestur />

            <hr />

            <SlettFellestur />

            <hr />

            <RedigerFellestur />


        </div>
        </PageWrapper>
    );
}