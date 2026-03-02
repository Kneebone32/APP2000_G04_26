import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

//Søker etter eksisterende fellesturer. Laget av Kay
//TODO: må oppdateres når jeg får tested sammen med backend. Feltene må endres (tur.fellestur_id)
export default function FellesturSøk({ fellesturer, onSelect, lagretTittel = "" }) {
    const { t } = useTranslation();
    const [søk, setSøk] = useState(lagretTittel);
    const [visDropdown, setVisDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const filterFellesturer = fellesturer?.filter(tur =>
        tur.tittel.toLowerCase().includes(søk.toLowerCase()) ||   //søk på tittel
        tur.fellestur_id.toString().includes(søk)                 //søk på ID
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
                {t("fellesturer.søk_fellestur")}
                <input
                    type="text"
                    placeholder={t("fellesturer.søk_placeholder")}
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
                    {filterFellesturer.length > 0 ? (
                        filterFellesturer.map((tur) => (
                            <li
                                key={tur.fellestur_id}
                                onClick={() => {
                                    setSøk(tur.tittel);
                                    onSelect(tur.fellestur_id, tur.tittel);
                                    setVisDropdown(false);
                                }}
                            >
                                <span className="tur-id">#{tur.fellestur_id}</span> {tur.tittel}
                            </li>
                        ))
                    ) : (
                        <li className="ingen-resultater">{t("fellesturer.ingen_resultater")}</li>
                    )}
                </ul>
            )}
        </div>
    );
}