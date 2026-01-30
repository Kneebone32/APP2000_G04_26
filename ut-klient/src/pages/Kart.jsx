import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import { Icon } from "leaflet";
import hytteMarker from "../assets/kart/hytte.png";
import "../App.css";
import "leaflet/dist/leaflet.css";





export default function kart_Basic(){
  //simulere hytter
  const hytter_lokasjon = [
    {
      geocode: [59.4087, 9.0593],
      popUp: "Hytte 1"
    },
    {
      geocode: [59.403166255660764, 9.070148700479844],
      popUp: "Hytte 2"
    },
    {
      geocode: [59.4111911162318, 9.070644187330702],
      popUp: "Hytte 3"
    },
  ];

  const hytteIcon = new Icon({
    iconUrl: hytteMarker,
    iconSize: [46, 46]
  })

    return(
        <MapContainer center={[59.4087, 9.0593]} zoom={13}>
        <TileLayer 
        attribution='&copy; <a href="https://www.norgeskartverk.no/">Norgeskartverkt</a>'
        url="https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png"
        />
        {hytter_lokasjon.map((hytte) => (
          <Marker position={hytte.geocode} icon={hytteIcon}>
            <Popup>{hytte.popUp}</Popup> 
          </Marker>
        ))}

        </MapContainer>
    );
}