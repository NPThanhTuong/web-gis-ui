import { useMapEvents } from "react-leaflet";

function MapClickMarker({ setMarker }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarker({ lat, lng });
    },
  });
  return null;
}

export default MapClickMarker;
