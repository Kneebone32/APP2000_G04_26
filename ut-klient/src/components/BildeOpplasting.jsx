import { useTranslation } from "react-i18next";
import { useFileUpload } from "../hooks/useFileUpload";
import "./BildeOpplastning.css";

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
                        {bildeUrl?.map((url, index) => (
                            <div key={index} style={{display: 'inline-block', position: 'relative', marginRight: '10px'}}>
                                <img
                                    className="Bilde"
                                    src={`${url}?w=200&h=200&fit=fit`}
                                    alt={`Preview ${index + 1}`}
                                />
                                <button
                                    className="fjern-bilde"
                                    type="button"
                                    onClick={() => setBildeUrl(bildeUrl.filter((_, i) => i !== index))}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                </div>
            )}
