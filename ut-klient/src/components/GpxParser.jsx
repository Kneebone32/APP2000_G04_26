import { parseGPX } from '@we-gold/gpxjs';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

//Laster opp og Parser koordinater fra GPX-fil. Hele filen laget av Kay med mindre annet er spesifisert
export const GpxParser = ({onKoordinaterLastet}) => {
  const { t } = useTranslation();
  
  const handleFileChange = (e) => {
    const fil = e.target.files[0];
    if (!fil) return;

    const leser = new FileReader();
    leser.onload = (event) => {
      try {
        const gpxText = event.target.result;
        
        const gpx = parseGPX(gpxText);
        const tracks = gpx[0]?.tracks || [];
        

        if (tracks.length > 0 && tracks[0].points.length > 0) {

          const koords = tracks[0].points.map(p => [p.latitude, p.longitude]);
          onKoordinaterLastet(koords);

        } else {
          toast.error(t("gpx.kunne_ikke_finne"));
        }

        } catch (err) {
        toast.error(t("gpx.feil_henting") + err);
      }
    };
    leser.readAsText(fil);
  };

return (
    <div className="gpx-filopplasting">
      <label className="gpx-filopplasting-label">
        {t("gpx.last_opp")}
      </label>
      <div>
      <input 
        type="file" 
        accept=".gpx" 
        onChange={handleFileChange} 
        className="gpx-filopplasting-input"
        aria-label='last opp GPX fil'
      />
      </div>
    </div>
  );
};