import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { isoUke } from "../../utils/filterUtforskerKart";

//Alle kartfilter til fellesturer. Hele filen laget av Kay med mindre annet er spesifisert
export default function KartFilterFellesturer({ filter, setFilter, fellesturer = [] }) {
  const [fellesturerFilterUtvidet, setFellesturerFilterUtvidet] = useState(false);
  const { t } = useTranslation();

  //lager et set med ukenummer basert på alle startdatoene til fellesturene. sortert
  const tilgjengeligeUker = useMemo(() => {
    const uker = new Set();
    fellesturer.forEach((f) => f.datoer?.forEach((d) => uker.add(isoUke(d.aktivitet_start_dato))));
    return [...uker].sort((a, b) => a - b);
  }, [fellesturer]);

  return (
    <div className="kart-filter-section">
      <button className="filter-toggle-button" onClick={() => setFellesturerFilterUtvidet(!fellesturerFilterUtvidet)}>
        {fellesturerFilterUtvidet ? "✕" : "☰"} {t("filter.fellesturer")}
      </button>

      {fellesturerFilterUtvidet && (
        <>
          {/*Fellestur - vis turer*/}
          <div className="fellesturer-kart-toggle">
            <label>
              <input
                type="checkbox"
                checked={filter.visFellesturer}
                onChange={(e) => {
                  const checked = e.target.checked; //fjerner turer hvis fellesturer blir vist på kartet
                  setFilter((prev) => ({
                    ...prev,
                    visFellesturer: checked,
                    visTurer: checked ? false : prev.visTurer,
                  }));
                }}
              />
              {t("filter.vis_fellesturer")}
            </label>
          </div>

          {/*Fellestur - søkefelt*/}
          <div className="filter-section">
            <label>
              {t("felles.søk")}:
              <input
                type="text"
                placeholder={t("fellesturer.søk_fellestur")}
                value={filter.søkeordFellesturer}
                onChange={(e) => setFilter((prev) => ({ ...prev, søkeordFellesturer: e.target.value }))}
              />
            </label>
          </div>

          {/*Fellestur - uke*/}
          <div className="fellesturer-kart-toggle">
            <label>
              Uke:
              <select
                value={filter.uke ?? ""}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    uke: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              >
                {/*Alle tilgjengelige uker*/}
                <option value="">Alle</option>
                {tilgjengeligeUker.map((uke) => (
                  <option key={uke} value={uke}>
                    Uke {uke}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </>
      )}
    </div>
  );
}
