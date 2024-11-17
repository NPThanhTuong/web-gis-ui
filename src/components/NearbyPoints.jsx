import { calculateDistance } from "@/helpers";
import { createCustomIcon } from "@/helpers/customMarker";
import { Marker, Popup } from "react-leaflet";
import MotelPopup from "./MotelPopup";

function NearbyPoints({ center, points, maxDistance, handleClickFindRoute }) {
  // Filter points within maxDistance (in km) from the center point
  const nearbyPoints = points?.filter((point) => {
    const { coordinates } = point.geometry;
    const distance = calculateDistance(
      center.lat,
      center.lng,
      coordinates[1],
      coordinates[0]
    );
    return distance <= maxDistance;
  });

  return (
    <>
      {nearbyPoints?.map((point, index) => {
        const { coordinates } = point.geometry;
        return (
          <Marker
            key={index}
            position={[coordinates[1], coordinates[0]]}
            icon={createCustomIcon("#FF0000")}
          >
            <Popup>
              <MotelPopup
                motelName={point.properties.name}
                motelDescription={point.properties.description}
                geom={point.geometry}
                handleClickFindRoute={handleClickFindRoute}
              />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default NearbyPoints;
