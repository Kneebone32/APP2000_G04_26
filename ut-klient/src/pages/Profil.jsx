import PageWrapper from "../components/PageWrapper";
import RedigerProfil from "../components/profil/rediger/RedigerProfil";
import RedigerPassord from "../components/profil/rediger/RedigerPassord";
import RedigerRolle from "../components/profil/rediger/RedigerRolle";
import { useTranslation } from "react-i18next";
import "./Profil.css";

//Profilside. Laget av Kay
export default function Profil() {
  const { t } = useTranslation();

  return (
    <div className="profil-container">
      <PageWrapper title={t("sider.profil")}>
        <hr />
        <RedigerProfil />
        <hr />
        <RedigerRolle />
        <hr />
        <RedigerPassord />
      </PageWrapper>
    </div>
  );
}
