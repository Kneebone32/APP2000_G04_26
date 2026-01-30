import PageWrapper from "../components/PageWrapper";
import {MapContainer, TileLayer} from "react-leaflet";
import { Icon } from "leaflet";
import hytteMarker from "../assets/kart/hytte.png";
import "leaflet/dist/leaflet.css";
import "./KartBasic.css";

//kartikon for hytter
export const hytteIcon = new Icon({
    iconUrl: hytteMarker,
    iconSize: [42, 42]
});

//kartikon for turstart
export const turStartIcon = new Icon({
    iconUrl: null, 
    iconSize: [42, 42]
});

//kartikon for turmål
export const turMålIcon = new Icon({
    iconUrl: null, 
    iconSize: [42, 42]
});

//Basic kart som kan bli brukt i utforsker, til å legge til turer og for posisjonstjenester (Laget av Kay)
export default function Kart_basic({ center = [59.4087, 9.0593], zoom = 13, children }) {
    return(
        <div className="kart-wrapper">
            <MapContainer center={center} zoom={zoom}>
                <TileLayer 
                    attribution='&copy; <a href="https://www.kartverket.no/">Kartverket</a>'
                    url="https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png"
                />
                {children}
            </MapContainer>
        </div>
    );
}