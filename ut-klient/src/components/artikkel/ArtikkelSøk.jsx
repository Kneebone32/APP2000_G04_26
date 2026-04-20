import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../fellesturer/fellestur-form/FellesturForm.css';

//Søker etter eksisterende artikler. Lik som FellesturSøk. Laget av Kay
export default function ArtikkelSøk({artikler, onSelect, lagretTittel = ''}) {
    const { t } = useTranslation();
    const [søk, setSøk] = useState(lagretTittel);
    const [visDropdown, setVisDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const filtrerte = artikler?.filter(a =>
        a.artikkel_tittel?.toLowerCase().includes(søk.toLowerCase()) ||
        a.artikkel_slug?.toLowerCase().includes(søk.toLowerCase())
    ) || [];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setVisDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="input-container søk" ref={dropdownRef}>
            <label className="input">
                {t("artikkel.søk_etter")}
                <input
                    type="text"
                    placeholder={t("artikkel.søk_placeholder")}
                    value={søk}
                    onChange={e => {
                        setSøk(e.target.value);
                        setVisDropdown(true);
                        if (e.target.value === '') onSelect(null, '');
                    }}
                    onFocus={() => setVisDropdown(true)}
                />
            </label>

            {visDropdown && (
                <ul className="søkeresultater">
                    {filtrerte.length > 0 ? (
                        filtrerte.map(a => (
                            <li
                                key={a.artikkel_slug}
                                onClick={() => {
                                    setSøk(a.artikkel_tittel);
                                    onSelect(a.artikkel_id, a.artikkel_tittel);
                                    setVisDropdown(false);
                                }}
                            >
                                <span className="tur-id">{a.artikkel_slug}</span> {a.artikkel_tittel}
                            </li>
                        ))
                    ) : (
                        <li className="ingen-resultater">{t("artikkel.ingen_funnet")}</li>
                    )}
                </ul>
            )}
        </div>
    );
}