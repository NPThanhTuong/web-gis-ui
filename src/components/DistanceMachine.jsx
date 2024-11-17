import { useMapEvents } from "react-leaflet";

function DistanceMachine({
  editingFirstPoint,
  setEditingFirstPoint,
  setFirstPoint,
  setSecondPoint,
  editingSecondPoint,
  setEditingSecondPoint,
}) {
  const handleMapClick = (e) => {
    if (editingFirstPoint) {
      setFirstPoint(e.latlng);
      setEditingFirstPoint(false);
    }

    if (editingSecondPoint) {
      setSecondPoint(e.latlng);
      setEditingSecondPoint(false);
    }
  };

  useMapEvents({
    click: handleMapClick,
  });
  return null;
}

export default DistanceMachine;
