import { useTranslation } from "react-i18next";
import { useFileUpload } from "../hooks/useFileUpload";

//Laster opp og viser bilder. Kode fra Olai, fil satt sammen av Kay
export default function BildeOpplasting({ bildeUrl, setBildeUrl }) {
    const { t } = useTranslation();
    useFileUpload(setBildeUrl);

    return (
        <div className="input-container">
            <label>{t("admin.last_opp_bilde")}:</label>
            <simple-file-upload
                accept="image/*"
                max-file-size="5242880"
                max-files="5"
                public-key={import.meta.env.VITE_SFU_PUBLIC_KEY}
            ></simple-file-upload>

                {bildeUrl && bildeUrl.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                        <p>{t("tur.bilde_lastet_opp")} ({bildeUrl.length})</p>
                        {bildeUrl.map((url, index) => (
                            <img 
                                key={index}
                                src={`${url}?w=200&h=200&fit=fit`} 
                                alt={`Preview ${index + 1}`}
                                style={{ marginRight: '10px' }}
                            />
                        ))}
                    </div>
                )}
                </div>
            )}
