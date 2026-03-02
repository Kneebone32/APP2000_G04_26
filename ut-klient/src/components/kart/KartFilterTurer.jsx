import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEnums } from "../../hooks/useEnums";

//Alle kartfilter til Turer. Hele filen laget av Kay med mindre annet er spesifisert
export default function KartFilterTurer({
  filter,
  setFilter,
  handleCheckboxChange,
}) {
  const [turerFilterUtvidet, setTurerFilterUtvidet] = useState(false);
  const { t } = useTranslation();
  const { enumData: vanskelighetsgrad, loadingEnum } = useEnums("vanskelighetsgrad_enum");
  const { enumData: varighet} = useEnums("varighet_enum");

  return (
    <div className="kart-filter-section">
      <button
        className="filter-toggle-button"
        onClick={() => setTurerFilterUtvidet(!turerFilterUtvidet)}
      >
        {turerFilterUtvidet ? "✕" : "☰"} {t("filter.turer")}
      </button>

      {turerFilterUtvidet && (
        <>
          {/*Turer - vis turer*/}
          <div className="turer-kart-toggle">
            <label>
              <input
                type="checkbox"
                checked={filter.visTurer}
                onChange={(e) => {const checked = e.target.checked; //fjerner fellesturer hvis turer blir vist på kartet
                    setFilter((prev) => ({
                    ...prev,
                    visTurer: checked,
                    visFellesturer: checked ? false : prev.visFellesturer,
                  }));}}
              />{" "}
              {t("filter.vis_turer")}
            </label>
          </div>

          {/*Turer - vanskelighetsgrad*/}
          <div className="filter-section">
            <label>{t("filter.vanskelighetsgrad")}:</label>

            {!loadingEnum && (
              <select
                value={filter.vanskelighetsgrad}
                onChange={(e) =>
                  setFilter({ ...filter, vanskelighetsgrad: e.target.value })
                }
              >
                <option value="" disabled selected hidden></option>
                {vanskelighetsgrad.map((valg) => (
                  <option key={valg} value={valg}>
                    {t(`enums.vanskelighetsgrad.${valg}`)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/*Turer - Turtype - Ble laget før jeg la til useEnums. Fiks hvis tid*/ }
          <div className="filter-section">
            <label>{t("filter.type")}:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={filter.turtype.includes("fottur")}
                  onChange={() => handleCheckboxChange("turtype", "fottur")}
                />{" "}
                {t("filter.fottur")}
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={filter.turtype.includes("sykkeltur")}
                  onChange={() => handleCheckboxChange("turtype", "sykkeltur")}
                />{" "}
                {t("filter.sykkeltur")}
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={filter.turtype.includes("skitur")}
                  onChange={() => handleCheckboxChange("turtype", "skitur")}
                />{" "}
                {t("filter.skitur")}
              </label>
            </div>
          </div>

          {/*Turer - turtype*/}
          <div className="filter-section">
            <label>{t("kart_detaljer.varighet")}</label>

            {!loadingEnum && (
              <select
                value={filter.varighet}
                onChange={(e) =>
                  setFilter({ ...filter, varighet: e.target.value })
                }
              >
                <option value="" disabled selected hidden></option>
                {varighet.map((valg) => (
                  <option key={valg} value={valg}>
                    {t(`enums.varighet.${valg}`)}
                  </option>
                ))}
              </select>
            )}
          </div>
        </>
      )}
    </div>
  );
}
