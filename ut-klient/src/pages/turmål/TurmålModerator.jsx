import LeggTilTurmål from "../../components/turmål/legg-til/LeggTilTurmål";
import RedigerTurmål from "../../components/turmål/rediger/RedigerTurmål";
import SlettTurmål from "../../components/turmål/slett/SlettTurmål";
import PageWrapper from "../../components/PageWrapper";
import { useTranslation } from "react-i18next";
import "./TurmålModerator.css";

//Basert på HytteModerator.jsx. Laget av Kay og Olai
export default function TurmålModerator() {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <div className="TurmålModeratorPanel">
        <h1>{t("turmål.moderator")}</h1>
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
