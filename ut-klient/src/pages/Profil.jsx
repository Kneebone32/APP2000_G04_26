import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAutentisering } from "../hooks/useAutentisering";
import RedigerProfil from "../components/profil/rediger/RedigerProfil";
import './Profil.css';
import RedigerPassord from "../components/profil/rediger/RedigerPassord";
import RedigerRolle from "../components/profil/rediger/RedigerRolle";

export default function Profil() {
  const { bruker, erAutentisert } = useAutentisering({autoFetch: true});
  const navigate = useNavigate();
  const { t } = useTranslation();

  //if(!erAutentisert) navigate('/login')

  return (
    <div className="profil-container">
      <PageWrapper title={t("sider.profil")} >
        <hr />
        <RedigerProfil/>
        <hr />
        <RedigerRolle/>
        <hr />
        <RedigerPassord/>
        <hr />
        <button 
          className="AdminKnapp"
          onClick={() => navigate('/admin')}
        >
          {t("profil.gå_til_admin")}
        </button>
      </PageWrapper>
    </div>
    
  );
}