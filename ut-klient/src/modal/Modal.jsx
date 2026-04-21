import "./Modal.css";
import L from "leaflet";
import { useEffect, useRef } from "react";

//Hele filen laget av Kay med mindre annet er spesifisert
export default function Modal({ show, onClose, title, children, size = "md" }) {
  const containerRef = useRef(null);

  //Hjelper Leaflet med å regne ut den faktiske størrelsen på Modal. Laget av AI
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 400);
    }
  }, [show]);

  //Forhindrer at knappetrykk faller igjennom til kartet. Takk stackoverflow.
  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
      L.DomEvent.disableScrollPropagation(containerRef.current);
    }
  }, []);

  if (!show) return null;

  return (
    <>
      {/*Backdrop til Modal*/}
      <div className="custom-modal-backdrop"></div>

      {/*Selve Modal*/}
      <div className="custom-modal-container" ref={containerRef}>
        <div className={`custom-modal-dialog custom-modal-${size}`} onClick={(e) => e.stopPropagation()}>
          <div className="custom-modal-content">
            <div className="custom-modal-header">
              <h5 className="custom-modal-title">{title}</h5>
              <button type="button" className="custom-modal-close" onClick={onClose} aria-label="Close">
                ×
              </button>
            </div>

            {children}
          </div>
        </div>
      </div>
    </>
  );
}
