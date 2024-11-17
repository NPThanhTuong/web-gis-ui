import DrawControl from "@/components/DrawControl";
import { axiosInstance } from "@/configs/axiosConfig";
import { convertToFeatureCollection, getGeoJsonData } from "@/helpers";
import { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Circle,
  Popup,
  Marker,
} from "react-leaflet";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateMotelForm from "@/components/UpdateMotelForm";
import MapClickMarker from "@/components/event/MapClickMarker";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clipboard } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MapClickPopup from "@/components/event/MapClickPopup";
import { toast } from "@/hooks/use-toast";

function AdminPage() {
  const [roomGeoJson, setRoomGeoJson] = useState();
  const [motelGeoJson, setMotelGeoJson] = useState();
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);
  const [currentAddFeature, setCurrentAddFeature] = useState();
  const [currentEditMotel, setCurrentEditMotel] = useState();
  const [currentDeleteMotelId, setCurrentDeleteMotelId] = useState(0);

  const [clickPos, setClickPos] = useState();
  const [updateMotelPosition, setUpdateMotelPosition] = useState();

  const [openAddRoomDialog, setOpenAddRoomDialog] = useState(false);
  const [openAddMotelDialog, setOpenAddMotelDialog] = useState(false);
  const [openDeleteMotelDialog, setOpenDeleteMotelDialog] = useState(false);

  const [parentMapKey, setParentMapKey] = useState(0);

  useEffect(() => {
    const getRooms = async () => {
      const res = await axiosInstance.get("Rooms");
      const data = res.data;

      setRoomGeoJson(getGeoJsonData(data));
    };

    const getMotels = async () => {
      const res = await axiosInstance.get("Motels");
      const data = res.data;

      setMotelGeoJson(getGeoJsonData(data));
      setLoading(false);
    };

    getRooms();
    getMotels();
  }, []);

  const addFeature = useCallback((newFeature) => {
    setFeatures((prevFeatures) => [...prevFeatures, newFeature]);
    setOpenAddMotelDialog(true);
    setCurrentAddFeature(newFeature);
  }, []);

  const updateFeature = useCallback((updatedFeature) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.properties.id === updatedFeature.properties.id
          ? updatedFeature
          : feature
      )
    );
  }, []);

  const deleteFeature = useCallback((featureId) => {
    setFeatures((prevFeatures) =>
      prevFeatures.filter((feature) => feature.properties.id !== featureId)
    );
  }, []);

  const handleClickUpdateMotelPopup = async (event) => {
    try {
      const motelId = event.target.dataset.id;
      const res = await axiosInstance.get("Motels/" + motelId);
      const motel = res.data;
      setCurrentEditMotel(motel);
      setOpenAddMotelDialog(true);
      setUpdateMotelPosition(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickDeleteMotelPopup = async (event) => {
    try {
      const motelId = event.target.dataset.id;
      setCurrentDeleteMotelId(motelId);
      setOpenDeleteMotelDialog(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteMotel = async () => {
    try {
      const res = await axiosInstance.delete("Motels/" + currentDeleteMotelId);

      toast({
        title: "Xóa thành công",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onEachMotelFeature = (feature, layer) => {
    const popupContent = `
      <div>
        <h3 style="font-weight: 700; font-size: 16px;">${feature.properties.name}</h3>
        <p style="font-size: 14px; color: #6b7280;">
          ${feature.properties.description}
        </p>
        <button
          style="
            padding: 6px 12px; 
            background-color: orange; 
            color: white;
            border: none;
            border-radius: 4px; 
            cursor: pointer;"
          type="button"
          id="motelPopupUpdateBtn"
          data-id=${feature.properties.id}
        >
          Cập nhật thông tin
        </button>

        <button
          style="
            padding: 6px 12px; 
            background-color: red; 
            color: white;
            border: none;
            border-radius: 4px; 
            cursor: pointer;"
          type="button"
          id="motelPopupDeleteBtn"
          data-id=${feature.properties.id}
        >
          Xóa nhà trọ
        </button>
      </div>
    `;

    layer.bindPopup(popupContent);

    layer.on("popupopen", () => {
      const updateButton = document.getElementById("motelPopupUpdateBtn");
      const deleteButton = document.getElementById("motelPopupDeleteBtn");

      if (updateButton) {
        updateButton.addEventListener("click", handleClickUpdateMotelPopup);
      }

      if (deleteButton) {
        deleteButton.addEventListener("click", handleClickDeleteMotelPopup);
      }
    });

    layer.on("popupclose", () => {
      const updateButton = document.getElementById("motelPopupUpdateBtn");
      const deleteButton = document.getElementById("motelPopupDeleteBtn");

      if (updateButton) {
        updateButton.removeEventListener("click", () => {});
      }

      if (deleteButton) {
        updateButton.removeEventListener("click", () => {});
      }
    });
  };

  const handleCopyToClipBoard = (clickPosition) => {
    const text = `[${clickPosition.lng},${clickPosition.lat}]`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Đã sao chép: " + text);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <div className="relative">
      <MapContainer
        center={[10.030301, 105.772119]}
        zoom={15}
        className="w-full h-screen z-0"
        key={parentMapKey}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {!loading && (
          <>
            <GeoJSON data={roomGeoJson} />
            <GeoJSON data={motelGeoJson} onEachFeature={onEachMotelFeature} />
          </>
        )}

        <DrawControl
          addFeature={addFeature}
          updateFeature={updateFeature}
          deleteFeature={deleteFeature}
        />

        <MapClickPopup setPopupPosition={setClickPos} />

        {clickPos && (
          <Popup position={clickPos}>
            <div>
              <div>
                <span className=" mr-4">Tọa độ:</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        onClick={() => handleCopyToClipBoard(clickPos)}
                      >
                        <Clipboard />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Sao chép tọa độ</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p>
                <strong>Kinh độ:</strong> {clickPos.lng}
              </p>
              <p>
                <strong>Vĩ độ:</strong> {clickPos.lat}
              </p>
            </div>
          </Popup>
        )}

        <Dialog
          open={openAddMotelDialog}
          onOpenChange={setOpenAddMotelDialog}
          key="updateMotelDialog"
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cập nhật nhà trọ</DialogTitle>
              <DialogDescription>
                Cập nhật nhà trọ. Nhấn lưu khi điền đầy đủ các thông tin.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full">
              <MapContainer
                center={[10.030301, 105.772119]}
                zoom={14}
                style={{ height: "300px", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapClickMarker setMarker={setUpdateMotelPosition} />

                {updateMotelPosition && (
                  <Marker
                    position={[
                      updateMotelPosition.lat,
                      updateMotelPosition.lng,
                    ]}
                  >
                    <Popup autoClose={false} autoPan={true}>
                      <div>
                        <strong>Tọa độ:</strong>
                        <br />
                        Kinh độ: {updateMotelPosition.lng}
                        <br />
                        Vĩ độ: {updateMotelPosition.lat}
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>

              <Button
                variant="destructive"
                className="my-3"
                onClick={() => setUpdateMotelPosition(null)}
              >
                Hủy chọn vị trí
              </Button>

              <UpdateMotelForm
                lat={updateMotelPosition?.lat}
                lng={updateMotelPosition?.lng}
                name={currentEditMotel?.name}
                description={currentEditMotel?.description}
                id={currentEditMotel?.id}
                setOpenAddMotelDialog={setOpenAddMotelDialog}
                setParentMapKey={setParentMapKey}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDeleteMotelDialog}
          onOpenChange={setOpenDeleteMotelDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa nhà trọ</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn xóa nhà trọ, khi xóa nhà trọ thì tất cả phòng
                trọ cũng sẽ bị xóa.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>

              <DialogClose asChild>
                <Button variant="destructive" onClick={handleDeleteMotel}>
                  Xóa
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </MapContainer>
    </div>
  );
}

export default AdminPage;
