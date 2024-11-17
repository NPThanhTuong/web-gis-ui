import L from "leaflet";

export const customFormatter = new L.Routing.Formatter({
  language: "en", // Set this to 'en' as a base language
  units: "metric",
  roundingSensitivity: 1000,
  formatInstruction: function (instruction) {
    console.log(instruction.type);
    // Custom translations for each type of instruction
    switch (instruction.type) {
      case "Straight":
        return "Đi thẳng"; // Vietnamese for 'Go straight'
      case "SlightRight":
        return "Rẽ nhẹ phải"; // Vietnamese for 'Slight right'
      case "Right":
        return "Rẽ phải"; // Vietnamese for 'Turn right'
      case "SharpRight":
        return "Rẽ gắt phải"; // Vietnamese for 'Sharp right'
      case "TurnAround":
        return "Quay lại"; // Vietnamese for 'Turn around'
      case "SharpLeft":
        return "Rẽ gắt trái"; // Vietnamese for 'Sharp left'
      case "Left":
        return "Rẽ trái"; // Vietnamese for 'Turn left'
      case "SlightLeft":
        return "Rẽ nhẹ trái"; // Vietnamese for 'Slight left'
      case "WaypointReached":
        return "Đã đến điểm dừng"; // Vietnamese for 'Waypoint reached'
      case "Roundabout":
        return "Đi vào vòng xoay"; // Vietnamese for 'Take the roundabout'
      case "DestinationReached":
        return "Đã đến nơi"; // Vietnamese for 'You have reached your destination'
      default:
        return instruction.text; // Default to the original text if not overridden
    }
  },
});
