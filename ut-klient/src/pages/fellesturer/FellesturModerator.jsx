import LeggTilFellestur from "../../components/fellesturer/legg-til/LeggTilFellestur";
import RedigerFellestur from "../../components/fellesturer/rediger/RedigerFellestur";
import SlettFellestur from "../../components/fellesturer/slett/SlettFellestur";
import LåsDato from "../../components/fellesturer/lås-dato/LåsDato";
//import { useFellesturer } from "../hooks/useFellesturer";
import PageWrapper from "../../components/PageWrapper";
import { useTranslation } from "react-i18next";
import './FellesturModerator.css';

//Basert på HytteModerator.jsx. Laget av Kay og Olai
export default function FellesturModerator({fellesturer} = {}) {
    //const { refetch } = useFellesturer(true);
    const { t } = useTranslation();

    return (
        <PageWrapper>
        <div className="FellesturModeratorPanel">
            <h1>{t("fellesturer.moderator")}</h1>
            <hr />
            <LeggTilFellestur />
            <hr />
            <RedigerFellestur fellesturer={fellesturer} />
            <hr />
            <LåsDato fellesturer={fellesturer} />
            <hr />
            <SlettFellestur fellesturer={fellesturer} />
        </div>
        </PageWrapper>
    );
}