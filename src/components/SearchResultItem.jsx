import { Milestone } from "lucide-react";
import { Button } from "./ui/button";

function SearchResultItem({ motelName, motelGeom, handleClickFindRoute }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-lg">{motelName}</h4>
      </div>
      <div className="flex flex-col items-center hover:cursor-pointer">
        <Button
          variant="outline"
          size="icon"
          onClick={handleClickFindRoute}
          data-destination={motelGeom}
        >
          <Milestone className="text-primary" />
        </Button>
        <span className="text-sm">Chỉ đường</span>
      </div>
    </div>
  );
}

export default SearchResultItem;
