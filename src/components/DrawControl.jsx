import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

function DrawControl({ addFeature, updateFeature, deleteFeature }) {
  const map = useMap();
  const featureGroupRef = useRef(new L.FeatureGroup());

  useEffect(() => {
    // Add FeatureGroup to the map to store editable layers
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
        marker: true,
        circlemarker: false,
      },
    });
    map.addControl(drawControl);

    const handleDrawCreated = (event) => {
      const { layer } = event;
      featureGroupRef.current.addLayer(layer);

      // Add unique identifier to the GeoJSON object
      const geoJson = layer.toGeoJSON();
      geoJson.properties = { ...geoJson.properties, id: layer._leaflet_id };
      addFeature(geoJson);

      // Bind a popup to the layer
      const popupContent = `Feature ID: ${layer._leaflet_id}<br>Type: ${geoJson.geometry.type}`;
      layer.bindPopup(popupContent);
    };

    const handleDrawEdited = (event) => {
      event.layers.eachLayer((layer) => {
        const geoJson = layer.toGeoJSON();
        geoJson.properties = { ...geoJson.properties, id: layer._leaflet_id };
        updateFeature(geoJson);
      });
    };

    const handleDrawDeleted = (event) => {
      event.layers.eachLayer((layer) => {
        deleteFeature(layer._leaflet_id);
      });
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
  }, [map, addFeature, updateFeature, deleteFeature]);

  return null;
}

export default DrawControl;
