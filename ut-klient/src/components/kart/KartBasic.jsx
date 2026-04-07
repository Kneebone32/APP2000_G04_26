import PageWrapper from "../PageWrapper";
import {MapContainer, TileLayer, ZoomControl} from "react-leaflet";
import { Icon } from "leaflet";
import hytteMarker from "../../assets/kart/hytte.png";
import markerNumber1 from "../../assets/kart/marker1.png";
import markerNumber2 from "../../assets/kart/marker2.png";
import markerNumber3 from "../../assets/kart/marker3.png";
import markerNumber4 from "../../assets/kart/marker4.png";
import markerNumber5 from "../../assets/kart/marker5.png";
import markerNumber6 from "../../assets/kart/marker6.png";
import turStartMarker from "../../assets/kart/tur.png";
import tur_full from "../../assets/kart/tur_full.png";
import tur_flex from "../../assets/kart/tur_flex.png";
import cameraIcon from "../../assets/kart/camera.png";
import FlyTilPosisjon from "../navigasjon/NavigasjonFinnPosisjon";
import "leaflet/dist/leaflet.css";
import "./KartBasic.css";

//kartikon for hytter
export const hytteIcon = new Icon({
    iconUrl: hytteMarker,
    iconSize: [38, 38],
    iconAnchor: [12, 12],
    className: 'no-scale-marker'
});

//kartikon for turstart
export const turIcon = new Icon({
    iconUrl: turStartMarker, 
    iconSize: [38, 38],
    className: 'no-scale-marker'
});

//kartikon for turmål
export const turmålIcon = new Icon({
    iconUrl: cameraIcon, 
    iconSize: [38, 38],
    iconAnchor: [21, 21],
    className: 'no-scale-marker'
});

//kartikon for fellestur fast startdato
export const fellesTurIcon = new Icon({
    iconUrl: turStartMarker, 
    iconSize: [42, 42],
    className: 'no-scale-marker'
});

//kartikon for fellestur med fleksibel startdato
export const fellesTurIconFleksibel = new Icon({
    iconUrl: tur_flex, 
    iconSize: [42, 42],
    className: 'no-scale-marker'
});

export const fellesTurIconFull = new Icon({
    iconUrl: tur_full, 
    iconSize: [42, 42],
    className: 'no-scale-marker'
});

//kartikon for navigasjon
export const navigasjonIcon = new Icon({
    iconUrl: turStartMarker,
    iconSize: [38, 38],
    iconAnchor: [12, 12],
    className: 'no-scale-marker'
});

export const marker1 = new Icon({
    iconUrl: markerNumber1,
    iconSize: [36, 36],
    iconAnchor: [21, 21],
    className: 'no-scale-marker'
});

export const marker2 = new Icon({
    iconUrl: markerNumber2,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    className: 'no-scale-marker'
});

export const marker3 = new Icon({
    iconUrl: markerNumber3,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    className: 'no-scale-marker'
});

export const marker4 = new Icon({
    iconUrl: markerNumber4,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    className: 'no-scale-marker'
});

export const marker5 = new Icon({
    iconUrl: markerNumber5,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    className: 'no-scale-marker'
});

export const marker6 = new Icon({
    iconUrl: markerNumber6,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    className: 'no-scale-marker'
});


//Basic kart som kan bli brukt i utforsker, til å legge til turer og for posisjonstjenester (Laget av Kay)
export default function Kart_basic({ center = [59.4087, 9.0593], zoom = 13, children }) {
    return(
        <div className="kart-wrapper">
            <MapContainer center={center} zoom={zoom} minZoom={5} zoomControl={false}>
                <TileLayer 
                    attribution='&copy; <a href="https://www.kartverket.no/">Kartverket</a>'
                    url="https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png"
                />
                <ZoomControl position="bottomright"/>
                <FlyTilPosisjon/>
                {children}
            </MapContainer>
        </div>
    );
}