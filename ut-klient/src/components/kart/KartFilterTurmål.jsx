import { useState } from "react";
import { useTranslation } from "react-i18next";

//Alle kartfilter til turmål. Hele filen laget av Kay med mindre annet er spesifisert
export default function KartFilterTurmål({ filter, setFilter }) {
  const [turmålFilterUtvidet, setTurmålFilterUtvidet] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="kart-filter-section">
      <button
        className="filter-toggle-button"
        onClick={() =>
          setTurmålFilterUtvidet(!turmålFilterUtvidet)
        }
      >
        {turmålFilterUtvidet ? "✕" : "☰"} {t("filter.turmål")}
      </button>

      {turmålFilterUtvidet && (
        <>
          {/*Turmål - vis turmål*/}
          <div className="turmål-kart-toggle">
            <label>
              <input
                type="checkbox"
                checked={filter.visTurmål}
                onChange={(e) =>
                  setFilter({ ...filter, visTurmål: e.target.checked })
                }
              />{" "}
               {t("filter.vis_turmål")}
            </label>
          </div>
        </>
      )}
    </div>
  );
}
