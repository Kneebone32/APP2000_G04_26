import PageWrapper from "../../components/PageWrapper";
import HytteKort from "../../components/hytter/HytteKort";
import TurKort from "../../components/turruter/TurKort";
import { useFavoritter } from "../../hooks/useFavoritter";
import { useFetchHytter } from "../../hooks/useFetchHytter";
import { useFetchTurer } from "../../hooks/useFetchTurer";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useTranslation } from "react-i18next";

//Viser brukerens favoritthytter og favorittturer. Laget av Kay
export default function Favoritter() {
  const { t } = useTranslation();
  const { token } = useAutentisering({ autoFetch: true });
  const { erHytteFavoritt, erTurFavoritt, toggleHytteFavoritt, toggleTurFavoritt } = useFavoritter({ token });
  const { hytter, loadingHytter } = useFetchHytter({ hytteKort: true });
  const { turer, loadingTurer } = useFetchTurer({ autoFetch: true });

  const favorittHytter = hytter.filter((h) => erHytteFavoritt(h.id));
  const favorittTurer = turer.filter((t) => erTurFavoritt(t.tur_id));

  return (
    <PageWrapper title={t("favoritter.tittel")}>
      <section>
        {loadingHytter && <p>{t("favoritter.laster_hytter")}</p>}
        {!loadingHytter && favorittHytter.length > 0 && (
          <div className="HyttekortContainer">
            {favorittHytter.map((hytte) => (
              <HytteKort
                key={hytte.id}
                hytteId={hytte.id}
                hytteNavn={hytte.navn}
                pris={hytte.pris}
                sengeplasser={hytte.sengeplasser}
                fylkeId={hytte.fylke_navn}
                kommuneId={hytte.kommune_navn}
                bildeUrl={hytte.hovedbilde_url}
                erFavoritt={erHytteFavoritt(hytte.id)}
                onToggleFavoritt={toggleHytteFavoritt}
              />
            ))}
          </div>
        )}
      </section>
      <section>
        {loadingTurer && <p>{t("favoritter.laster_turer")}</p>}
        {!loadingTurer && favorittTurer.length > 0 && (
          <div className="TurKortContainer">
            {favorittTurer.map((tur) => (
              <TurKort
                key={tur.tur_id}
                turId={tur.tur_id}
                turNavn={tur.tur_navn}
                vanskelighetsgrad={tur.vanskelighetsgrad}
                bildeUrl={tur.bilder?.[0]?.tur_url}
                turtype={tur.turtype}
                varighet={tur.varighet}
                lat={tur.punkter?.[0]?.[0]}
                lon={tur.punkter?.[0]?.[1]}
                erFavoritt={erTurFavoritt(tur.tur_id)}
                onToggleFavoritt={toggleTurFavoritt}
              />
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
