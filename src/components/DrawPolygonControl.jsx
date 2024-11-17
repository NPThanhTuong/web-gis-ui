import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

function DrawPolygonControl({ setUpdateRoomPosition }) {
  const map = useMap();
  const featureGroupRef = useRef(new L.FeatureGroup());

  useEffect(() => {
    map.addLayer(featureGroupRef.current);

    // Initialize Leaflet Draw controls
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: featureGroupRef.current,
      },
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });
    map.addControl(drawControl);

    const handleDrawCreated = (event) => {
      const { layer } = event;
      // featureGroupRef.current.addLayer(layer);

      // Add unique identifier to the GeoJSON object
      const geoJson = layer.toGeoJSON();
      geoJson.properties = { ...geoJson.properties, id: layer._leaflet_id };
      setUpdateRoomPosition(geoJson);
    };

    const handleDrawEdited = (event) => {
      event.layers.eachLayer((layer) => {
        const geoJson = layer.toGeoJSON();
        geoJson.properties = { ...geoJson.properties, id: layer._leaflet_id };
        setUpdateRoomPosition(geoJson);
      });
    };

    const handleDrawDeleted = (event) => {
      setUpdateRoomPosition(null);
    };

    map.on("draw:created", handleDrawCreated);
    map.on("draw:edited", handleDrawEdited);
    map.on("draw:deleted", handleDrawDeleted);

    return () => {
      map.off("draw:created", handleDrawCreated);
      map.off("draw:edited", handleDrawEdited);
      map.off("draw:deleted", handleDrawDeleted);
      map.removeControl(drawControl);
      map.removeLayer(featureGroupRef.current);
    };
  }, [map, setUpdateRoomPosition]);

  return null;
}

export default DrawPolygonControl;
