import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

function RoutingMachine({ start, end }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]), // Start location
        L.latLng(end[0], end[1]), // End location
      ],
      routeWhileDragging: false,
      // Use OSRM service for routing
      router: L.Routing.osrmv1({
        serviceUrl: `https://router.project-osrm.org/route/v1/`,
      }),
      showAlternatives: true,
      createMarker: function () {
        return null;
      }, // Hide default markers
    }).addTo(map);

    routingControl.on("routesfound", function (e) {
      const routes = e.routes;
      routes.forEach((route) => {
        route.instructions.forEach((instruction) => {
          switch (instruction.type) {
            case "Straight":
              instruction.text = "Đi thẳng";
              break;
            case "SlightRight":
              instruction.text = "Rẽ nhẹ phải";
              break;
            case "Right":
              instruction.text = "Rẽ phải";
              break;
            case "SharpRight":
              instruction.text = "Rẽ gắt phải";
              break;
            case "TurnAround":
              instruction.text = "Quay lại";
              break;
            case "SharpLeft":
              instruction.text = "Rẽ gắt trái";
              break;
            case "Left":
              instruction.text = "Rẽ trái";
              break;
            case "SlightLeft":
              instruction.text = "Rẽ nhẹ trái";
              break;
            case "WaypointReached":
              instruction.text = "Đã đến điểm dừng";
              break;
            case "Roundabout":
              instruction.text = "Đi vào vòng xoay";
              break;
            case "DestinationReached":
              instruction.text = "Đã đến nơi";
              break;
          }
        });
      });
    });

    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, start, end]);

  return null;
}

export default RoutingMachine;
