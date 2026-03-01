import { parseGPX } from '@we-gold/gpxjs';
import { toast } from 'react-toastify';

//Laster opp og Parser koordinater fra GPX-fil. Hele filen laget av Kay med mindre annet er spesifisert
export const GpxParser = ({onKoordinaterLastet}) => {
  
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
          toast.error("Kunne ikke finne koordinatene i filen");
        }

        } catch (err) {
        toast.error("Noe gikk galt ved henting av koordinater fra fil: " + err);
      }
    };
    leser.readAsText(fil);
  };

return (
    <div className="gpx-filopplasting">
      <label className="gpx-filopplasting-label">
        Last opp GPX fil
      </label>
      <div>
      <input 
        type="file" 
        accept=".gpx" 
        onChange={handleFileChange} 
        className="gpx-filopplasting-input"
      />
      </div>
    </div>
  );
};