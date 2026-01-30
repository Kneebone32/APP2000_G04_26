import {MapContainer, TileLayer} from "react-leaflet";
import { Icon } from "leaflet";
import hytteMarker from "../assets/kart/hytte.png";
import "leaflet/dist/leaflet.css";
import "./KartBasic.css";

// Export the icon so it can be used in other components
export const hytteIcon = new Icon({
    iconUrl: hytteMarker,
    iconSize: [42, 42]
});

export default function Kart_basic({ center = [59.4087, 9.0593], zoom = 13, children }) {
    return(
        <MapContainer center={center} zoom={zoom}>
            <TileLayer 
                attribution='&copy; <a href="https://www.kartverket.no/">Kartverket</a>'
                url="https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png"
            />
            {children}
        </MapContainer>
    );
}