import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatFellesturDato } from "../../utils/datoUtils";
import { DATO_STATUS } from "../../constants/konstanter";
import "./FellesturKort.css";

export default function FellesturKort({ fellesturId, fellesturNavn, bildeUrl, dato, startDato, sluttDato }) {
  const { t } = useTranslation();

  const valgtDato = dato?.find((d) => d.aktivitet_dato_status === DATO_STATUS.VALGT);
  const aktive = dato?.filter((d) => d.aktivitet_dato_status !== DATO_STATUS.AVLYST) ?? [];
  const fleksibel = !valgtDato && aktive.length > 1;
  const enkeltDato = valgtDato ?? aktive[0] ?? (startDato ? { aktivitet_start_dato: startDato, aktivitet_slutt_dato: sluttDato } : null);

  return (
    <div className="Fellesturkort">
      <Link to={`/fellesturer/${fellesturId}`} className="FellesturLink">
        <div className="Hovedkort">
          {bildeUrl && <img src={`${bildeUrl}?w=200&h=200&fit=fit`} alt={fellesturNavn} className="FellesturBilde" />}
          <div className="kortbody">
            <h3 className="korttitle">{fellesturNavn}</h3>
            {fleksibel ? (
              <>
                <strong>
                  <u>Fleksibel startdato:</u>
                </strong>
                {aktive.map((d) => (
                  <p key={d.aktivitet_dato_id} className="startdato">
                    {formatFellesturDato(d.aktivitet_start_dato)}
                  </p>
                ))}
              </>
            ) : (
              <>
                {valgtDato && (
                  <strong>
                    <u>Dato valgt:</u>
                  </strong>
                )}
                <p className="startdato">Start: {formatFellesturDato(enkeltDato?.aktivitet_start_dato)}</p>
                {enkeltDato?.aktivitet_slutt_dato && enkeltDato.aktivitet_slutt_dato != enkeltDato.aktivitet_start_dato && (
                  <p className="sluttdato">Slutt: {formatFellesturDato(enkeltDato.aktivitet_slutt_dato)}</p>
                )}
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
