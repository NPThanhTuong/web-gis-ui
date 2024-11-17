import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { axiosInstance } from "@/configs/axiosConfig";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchResultItem from "./SearchResultItem";
import { twMerge } from "tailwind-merge";

function SearchResultPanel({ className, handleClickFindRoute }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("search");
  const [loading, setLoading] = useState(true);
  const [motels, setMotels] = useState([]);

  useEffect(() => {
    const getMotels = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("Motels", {
          params: {
            search: searchValue,
          },
        });

        const motels = res.data;
        setMotels(motels);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    getMotels();
  }, [searchValue]);

  return (
    <>
      {searchValue?.trim() && (
        <Card className={twMerge("", className)}>
          <CardHeader>
            <CardTitle>Kết quả tìm kiếm</CardTitle>
            <CardDescription>
              Tham khảo các kết quả tìm kiếm được
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Đang tải</p>
            ) : motels.length > 0 ? (
              motels.map((motel, index) => (
                <SearchResultItem
                  handleClickFindRoute={handleClickFindRoute}
                  key={index + "_search_result"}
                  motelName={motel?.name}
                  motelGeom={motel?.geom}
                />
              ))
            ) : (
              <p>Không tìm thấy</p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default SearchResultPanel;
