import PageWrapper from "../components/PageWrapper";
import { useTranslation } from "react-i18next";
import "./Home.css";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="Home">
      <PageWrapper title={t("velkommen")} />
    </div>
  );
}
