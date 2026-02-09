import PageWrapper from "../components/PageWrapper";
import { useTranslation } from "react-i18next";

export default function Turer() {
  const { t } = useTranslation();
  return <PageWrapper title={t("sider.turer")} />;
}