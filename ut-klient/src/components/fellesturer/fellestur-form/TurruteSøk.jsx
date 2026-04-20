import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

//Søker etter tur for å bruke som Fellestur. Laget av Kay
export default function TurruteSøk({ turer, onSelect, lagretNavn = "" }) {
  const { t } = useTranslation();
  const [søk, setSøk] = useState(lagretNavn);
  const [visDropdown, setVisDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const filterTurer =
    turer?.filter(
      (tur) =>
        tur.turrute_navn.toLowerCase().includes(søk.toLowerCase()) || //søk på tur navn
        tur.turrute_id.toString().includes(søk), //søk på ID
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
        {t("turrute_søk.velg_turrute")}
        <input
          type="text"
          placeholder={t("turrute_søk.søk_placeholder")}
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
          {filterTurer.length > 0 ? (
            filterTurer.map((tur) => (
              <li
                key={tur.turrute_id}
                onClick={() => {
                  setSøk(tur.turrute_navn);
                  onSelect(tur.turrute_id, tur.turrute_navn, tur);
                  setVisDropdown(false);
                }}
              >
                <span className="tur-id">#{tur.turrute_id}</span> {tur.turrute_navn}
              </li>
            ))
          ) : (
            <li className="ingen-resultater">{t("turrute_søk.ingen_resultater")}</li>
          )}
        </ul>
      )}
    </div>
  );
}
