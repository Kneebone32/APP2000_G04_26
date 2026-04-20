import { Marker, Polyline, Popup } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

//Ekstra fil for utheve Polyline når bruker holder over linjen. Laget av Kay
export function HoverPolyline({ punkter, children, standardVekt = 7, hoverVekt = 11, farge = "#0dbbcb", onKlikk }) {
  const [vekt, setVekt] = useState(standardVekt);

  return (
    <>
      <Polyline
        positions={punkter}
        eventHandlers={{
          mouseover: () => setVekt(hoverVekt),
          mouseout: () => setVekt(standardVekt),
          click: (e) => {
            L.DomEvent.stopPropagation(e);
            if (onKlikk) {
              onKlikk(e, punkter);
            }
          },
        }}
        pathOptions={{
          color: farge,
          weight: vekt,
          opacity: 0.8,
        }}
      >
        {children}
      </Polyline>
    </>
  );
}
