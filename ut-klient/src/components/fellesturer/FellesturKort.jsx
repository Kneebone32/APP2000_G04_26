import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatFellesturDato } from "../../utils/datoUtils";
import './FellesturKort.css';

export default function FellesturKort({fellesturId, fellesturNavn, bildeUrl, dato, startDato, sluttDato}) {
    const { t } = useTranslation();

    const fleksibel = dato?.length > 1;
    const enkeltDato = dato?.[0] || startDato;

    return (
        <div className="Fellesturkort">
            <Link to={`/fellesturer/${fellesturId}`} className="FellesturLink">
                <div className="Hovedkort">
                    {bildeUrl && (
                        <img
                            src={`${bildeUrl}?w=200&h=200&fit=fit`}
                            alt={fellesturNavn}
                            className="FellesturBilde"
                            />
                    )}
                    <div className="kortbody">
                        <h3 className="korttitle">{fellesturNavn}</h3>
                        {fleksibel ? (
                            <>
                                <strong><u>Fleksibel startdato:</u></strong>
                                {dato.map((d) => (
                                    <p key={d.aktivitet_dato_id} className="startdato">
                                        {formatFellesturDato(d.aktivitet_start_dato)}
                                    </p>
                                ))}
                            </>
                        ) : (
                            <>
                                <p className="startdato">Start: {formatFellesturDato(enkeltDato?.aktivitet_start_dato || startDato)}</p>
                                {(enkeltDato?.aktivitet_slutt_dato || sluttDato) && (
                                    <p className="sluttdato">Slutt: {formatFellesturDato(enkeltDato?.aktivitet_slutt_dato || sluttDato)}</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}