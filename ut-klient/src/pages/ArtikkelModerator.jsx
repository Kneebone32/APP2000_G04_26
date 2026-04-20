import LeggTilArtikkel from "../components/artikkel/LeggTilArtikkel";
import RedigerArtikkel from "../components/artikkel/RedigerArtikkel";
import SlettArtikkel from "../components/artikkel/SlettArtikkel";
import PageWrapper from "../components/PageWrapper";
import { useTranslation } from "react-i18next";

//Adminside for artikler. Laget av Kay
export default function ArtikkelModerator() {
  const { t } = useTranslation();
  return (
    <PageWrapper>
      <div className="FellesturModeratorPanel">
        <h1>{t("artikkel.moderator_tittel")}</h1>
        <hr />
        <LeggTilArtikkel />
        <hr />
        <RedigerArtikkel />
        <hr />
        <SlettArtikkel />
      </div>
    </PageWrapper>
  );
}
