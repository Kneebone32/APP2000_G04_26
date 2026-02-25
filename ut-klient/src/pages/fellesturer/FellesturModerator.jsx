import LeggTilFellestur from "../../components/fellesturer/LeggTilFellestur";
//import SlettFellestur from "../components/SlettFellestur";
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
            
            <LeggTilFellestur />

            <hr />

            


        </div>
        </PageWrapper>
    );
}