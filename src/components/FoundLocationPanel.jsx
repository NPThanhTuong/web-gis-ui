import SearchResultItem from "./SearchResultItem";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";

function FoundLocationPanel({ motelGeoJsons, handleClickFindRoute }) {
  return (
    <Card className={twMerge("", className)}>
      <CardHeader>
        <CardTitle>Kết quả tìm kiếm</CardTitle>
        <CardDescription>Tham khảo các kết quả tìm kiếm được</CardDescription>
      </CardHeader>
      <CardContent>
        {motelGeoJsons?.map((motel, index) => (
          <SearchResultItem
            handleClickFindRoute={handleClickFindRoute}
            key={index + "_search_result"}
            motelName={motel?.properties.name}
            motelGeom={motel?.geometry}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default FoundLocationPanel;
