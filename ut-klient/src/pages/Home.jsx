import PageWrapper from "../components/PageWrapper";
import { useTranslation } from "react-i18next";
import "./Home.css";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="Home">
      <PageWrapper title={t("velkommen")}> 
        <h1>God påske!</h1>
        <img src="../public/testfiler/påske1.gif" />
        </PageWrapper>
    </div>
  );
}
