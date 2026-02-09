import PageWrapper from "../components/PageWrapper";
import { useTranslation } from "react-i18next";

export default function Annonser() {
  const { t } = useTranslation();
  return <PageWrapper title={t("sider.annonser")} />;
}