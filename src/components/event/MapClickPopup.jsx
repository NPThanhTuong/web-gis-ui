import { useMapEvent } from "react-leaflet";

function MapClickPopup({ setPopupPosition }) {
  useMapEvent("click", (e) => {
    setPopupPosition(e.latlng);
  });

  return null;
}

export default MapClickPopup;
