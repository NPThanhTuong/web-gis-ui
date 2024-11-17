import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

function MotelPopup({
  handleClickFindRoute,
  motelName,
  motelDescription,
  geom,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{motelName}</CardTitle>
        <CardDescription>{motelDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleClickFindRoute}
          data-destination={JSON.stringify(geom)}
        >
          Tìm đường
        </Button>
      </CardContent>
    </Card>
  );
}

export default MotelPopup;
