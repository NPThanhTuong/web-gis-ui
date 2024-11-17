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
import CreateMotelForm from "@/components/CreateMotelForm";
import { useNavigate } from "react-router-dom";
import CreateRoomForm from "@/components/CreateRoomForm";
import DrawPolygonControl from "@/components/DrawPolygonControl";
import UpdateRoomForm from "@/components/UpdateRoomForm";

function AdminPage() {
  const [roomGeoJson, setRoomGeoJson] = useState();
  const [motelGeoJson, setMotelGeoJson] = useState();
  const [loading, setLoading] = useState(true);
  const [currentAddFeature, setCurrentAddFeature] = useState();
  const [currentEditMotel, setCurrentEditMotel] = useState();
  const [currentEditRoom, setCurrentEditRoom] = useState();
  const [currentDeleteMotelId, setCurrentDeleteMotelId] = useState(0);
  const [currentDeleteRoomId, setCurrentDeleteRoomId] = useState(0);

  const [clickPos, setClickPos] = useState();
  const [updateMotelPosition, setUpdateMotelPosition] = useState();
  const [updateRoomPosition, setUpdateRoomPosition] = useState();

  const [openAddRoomDialog, setOpenAddRoomDialog] = useState(false);
  const [openUpdateMotelDialog, setOpenUpdateMotelDialog] = useState(false);
  const [openUpdateRoomDialog, setOpenUpdateRoomDialog] = useState(false);
  const [openDeleteMotelDialog, setOpenDeleteMotelDialog] = useState(false);
  const [openDeleteRoomDialog, setOpenDeleteRoomDialog] = useState(false);
  const [openCreateMotelDialog, setOpenCreateMotelDialog] = useState(false);
  const [openCreateRoomDialog, setOpenCreateRoomDialog] = useState(false);

  const navigate = useNavigate();

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
    if (newFeature.geometry.type === "Point") setOpenCreateMotelDialog(true);
    else setOpenCreateRoomDialog(true);
    setCurrentAddFeature(newFeature);
    console.log(newFeature);
  }, []);

  const updateFeature = useCallback((updatedFeature) => {
    // setFeatures((prevFeatures) =>
    //   prevFeatures.map((feature) =>
    //     feature.properties.id === updatedFeature.properties.id
    //       ? updatedFeature
    //       : feature
    //   )
    // );
  }, []);

  const deleteFeature = useCallback((featureId) => {
    // setFeatures((prevFeatures) =>
    //   prevFeatures.filter((feature) => feature.properties.id !== featureId)
    // );
  }, []);

  const handleClickUpdateMotelPopup = async (event) => {
    try {
      const motelId = event.target.dataset.id;
      const res = await axiosInstance.get("Motels/" + motelId);
      const motel = res.data;
      setCurrentEditMotel(motel);
      setOpenUpdateMotelDialog(true);
      setUpdateMotelPosition(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickUpdateRoomPopup = async (event) => {
    try {
      const roomId = event.target.dataset.id;
      const res = await axiosInstance.get("Rooms/" + roomId);
      const room = res.data;
      setCurrentEditRoom(room);
      setOpenUpdateRoomDialog(true);
      setUpdateRoomPosition(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickDeleteRoomPopup = (event) => {
    const roomId = event.target.dataset.id;
    setCurrentDeleteRoomId(roomId);
    setOpenDeleteRoomDialog(true);
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
        title: "Xóa nhà trọ thành công",
        description:
          "Nhà trọ đã được xóa thành công, tất cả các phòng trọ thuộc nhà trọ cũng đã được xóa khỏi hệ thống.",
      });
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const res = await axiosInstance.delete("Rooms/" + currentDeleteRoomId);

      toast({
        title: "Thành công",
        description: "Phòng trọ đã được xóa thành công.",
      });
      navigate(0);
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

  const onEachRoomFeature = (feature, layer) => {
    const { properties } = feature;

    const popupContent = `
      <div>
        <h3 style="font-weight: 700; font-size: 16px;">${
          properties.motel.name
        }</h3>
        <div>
          <strong>Mã phòng: </strong>
          <span>${properties.id}</span>
        </div>
        <div style="margin-top: 4px">
          <strong>Giá: </strong>
          <span>
            ${(properties.price * 1000).toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </div>

        <div style="margin-top: 4px">
          <strong>Sức chứa: </strong>
          <span>${properties.capability}</span>
        </div>

        <div style="margin-top: 4px">
          <strong>Tình trạng: </strong>
          <span>${properties.isAvailable ? "Trống" : "Đã thuê"}</span>
        </div>

        <div style="margin-top: 4px">
          <strong>Gác lửng: </strong>
          <span>${properties.isMezzanine ? "Có" : "Không"}</span>
        </div>

        <div style="margin-top: 4px">
          <strong>Mô tả: </strong>
          <span>${properties.description}</span>
        </div>
        <button
          style="
            padding: 6px 12px; 
            background-color: orange; 
            color: white;
            border: none;
            border-radius: 4px; 
            cursor: pointer;"
          type="button"
          id="roomPopupUpdateBtn"
          data-id=${properties.id}
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
          id="roomPopupDeleteBtn"
          data-id=${properties.id}
        >
          Xóa phòng trọ
        </button>
      </div>
    `;

    layer.bindPopup(popupContent);

    layer.on("popupopen", () => {
      const updateButton = document.getElementById("roomPopupUpdateBtn");
      const deleteButton = document.getElementById("roomPopupDeleteBtn");

      if (updateButton) {
        updateButton.addEventListener("click", handleClickUpdateRoomPopup);
      }

      if (deleteButton) {
        deleteButton.addEventListener("click", handleClickDeleteRoomPopup);
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

  const handleClickCreatePopup = (e) => {
    const geometryType = e.target.dataset.type;
    if (geometryType === "Point") {
      setOpenCreateMotelDialog(true);
    } else {
      setOpenCreateRoomDialog(true);
    }
  };

  return (
    <div className="relative">
      <MapContainer
        center={[10.030301, 105.772119]}
        zoom={15}
        className="w-full h-screen z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {!loading && (
          <>
            <GeoJSON data={roomGeoJson} onEachFeature={onEachRoomFeature} />
            <GeoJSON data={motelGeoJson} onEachFeature={onEachMotelFeature} />
          </>
        )}

        <DrawControl
          addFeature={addFeature}
          updateFeature={updateFeature}
          deleteFeature={deleteFeature}
          handleClickCreatePopup={handleClickCreatePopup}
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
          open={openUpdateMotelDialog}
          onOpenChange={setOpenUpdateMotelDialog}
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
                setOpenUpdateMotelDialog={setOpenUpdateMotelDialog}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDeleteMotelDialog}
          onOpenChange={setOpenDeleteMotelDialog}
          key="deleteMotelDialog"
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

        <Dialog
          open={openCreateMotelDialog}
          onOpenChange={setOpenCreateMotelDialog}
          key="createMotelDialog"
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm mới nhà trọ</DialogTitle>
              <DialogDescription>
                Thêm nhà trọ. Nhấn lưu khi điền đầy đủ các thông tin.
              </DialogDescription>
            </DialogHeader>

            <CreateMotelForm
              feature={currentAddFeature}
              setOpenCreateMotelDialog={setOpenCreateMotelDialog}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={openCreateRoomDialog}
          onOpenChange={setOpenCreateRoomDialog}
          key="createRoomDialog"
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm mới phòng trọ</DialogTitle>
              <DialogDescription>
                Thêm phòng trọ cho nhà trọ. Nhấn lưu khi điền đầy đủ các thông
                tin.
              </DialogDescription>
            </DialogHeader>
            <CreateRoomForm
              feature={currentAddFeature}
              setOpenCreateRoomDialog={setOpenCreateRoomDialog}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={openUpdateRoomDialog}
          onOpenChange={setOpenUpdateRoomDialog}
          key="updateRoomDialog"
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cập nhật phòng trọ</DialogTitle>
              <DialogDescription>
                Cập nhật phòng trọ. Nhấn lưu khi điền đầy đủ các thông tin.
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

                <DrawPolygonControl
                  setUpdateRoomPosition={setUpdateRoomPosition}
                />

                {updateRoomPosition && <GeoJSON data={updateRoomPosition} />}
              </MapContainer>

              <Button
                variant="destructive"
                className="my-3"
                onClick={() => setUpdateRoomPosition(null)}
              >
                Hủy chọn vị trí
              </Button>

              <UpdateRoomForm
                feature={updateRoomPosition}
                room={currentEditRoom}
                setOpenUpdateRoomDialog={setOpenUpdateRoomDialog}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDeleteRoomDialog}
          onOpenChange={setOpenDeleteRoomDialog}
          key="deleteRoomDialog"
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa phòng trọ</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn xóa phòng trọ không?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>

              <DialogClose asChild>
                <Button variant="destructive" onClick={handleDeleteRoom}>
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
