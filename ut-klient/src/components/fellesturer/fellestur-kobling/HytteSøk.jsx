import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

//Søker etter hytte for å bruke i Fellestur. Laget av Kay
export default function HytteSøk({ hytter, onSelect, lagretNavn = "" }) {
    const { t } = useTranslation();
    const [søk, setSøk] = useState(lagretNavn);
    const [visDropdown, setVisDropdown] = useState(false);
    const dropdownRef = useRef(null);


    const filterHytter = hytter?.filter(hytte =>
        hytte.navn.toLowerCase().includes(søk.toLowerCase()) ||   //søk på hytte navn
        hytte.hytte_id.toString().includes(søk)                         //søk på ID
    ) || [];

    //Lukker dropdown når bruker klikker på utsiden
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setVisDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="input-container søk" ref={dropdownRef}>
            <label className="input">
                {t("hytte_søk.velg_hytte")}
                <input
                    type="text"
                    placeholder={t("hytte_søk.søk_placeholder")}
                    value={søk}
                    onChange={(e) => {
                        setSøk(e.target.value);
                        setVisDropdown(true);
                        if (e.target.value === "") onSelect(0, "");
                    }}
                    onFocus={() => setVisDropdown(true)}
                    required
                />
            </label>

            {visDropdown && (
                <ul className="søkeresultater">
                    {filterHytter.length > 0 ? (
                        filterHytter.map((hytte) => (
                            <li
                                key={hytte.hytte_id}
                                onClick={() => {
                                    setSøk(hytte.navn);
                                    onSelect(hytte.hytte_id, hytte.navn, hytte);
                                    setVisDropdown(false);
                                }}
                            >
                                <span className="hytte-id">#{hytte.hytte_id}</span> {hytte.navn}
                            </li>
                        ))
                    ) : (
                        <li className="ingen-resultater">{t("hytte_søk.ingen_resultater")}</li>
                    )}
                </ul>
            )}
        </div>
    );
}