import PageWrapper from "../components/PageWrapper";
import { useTranslation } from "react-i18next";

export default function Fellesturer() {
  const { t } = useTranslation();
  return <PageWrapper title={t("sider.fellesturer")} />;
}