import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// import lgThumbnail from "lightgallery/plugins/thumbnail";
// import lgZoom from "lightgallery/plugins/zoom";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { axiosInstance } from "@/configs/axiosConfig";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Circle } from "react-leaflet";
import LightGallery from "lightgallery/react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { ScrollArea } from "@/components/ui/scroll-area";
import SearchBar from "@/components/SearchBar";
import SearchResultPanel from "@/components/SearchResultPanel";
import RoutingMachine from "@/components/RoutingMachine";
import NearbyPoints from "@/components/NearbyPoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGeoJsonData } from "@/helpers";

function HomePage() {
  const [currentRoom, setCurrentRoom] = useState();
  const [roomGeoJson, setRoomGeoJson] = useState();
  const [motelGeoJson, setMotelGeoJson] = useState();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const lightGallery = useRef(null);
  const [startPoint, setStartPoint] = useState([]);
  const [endPoint, setEndPoint] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(null);

  useEffect(() => {
    // Try to get user location if allowed
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.log("Error fetching location:", error)
    );
  }, []);

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

  const onInit = useCallback((detail) => {
    if (detail) {
      lightGallery.current = detail.instance;
    }
  }, []);

  const handleClickImage = (index) => {
    lightGallery.current.openGallery(index);
  };

  // Event handler for when a polygon is clicked
  const onPolygonClick = (event) => {
    const layer = event.target;
    setCurrentRoom(layer.feature.properties);
    setOpen(!open);
  };

  // Function to add click event to each feature
  const onEachRoomFeature = (feature, layer) => {
    layer.on({
      click: onPolygonClick,
    });
  };

  const onEachMotelFeature = (feature, layer) => {
    const popupContent = `
      <div>
        <h3 style="font-weight: 700; font-size: 16px;">${
          feature.properties.name
        }</h3>
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
          id="motelPopup"
          data-destination=${JSON.stringify(feature.geometry)}
        >
          Tìm đường
        </button>
      </div>
    `;

    layer.bindPopup(popupContent);

    layer.on("popupopen", () => {
      const button = document.getElementById("motelPopup");
      if (button) {
        button.addEventListener("click", handleClickFindRoute);
      }
    });

    layer.on("popupclose", () => {
      const button = document.getElementById("motelPopup");
      if (button) {
        button.removeEventListener("click", () => {});
      }
    });
  };

  const handleClickFindInRadius = (e) => {
    e.preventDefault();
    const radiusVal = e.target.radius.value;
    setRadius(radiusVal);
  };

  const handleClickFindRoute = (event) => {
    console.log(event.target.getAttribute("data-destination"));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const depart = [pos.coords.latitude, pos.coords.longitude];
          const destination = [
            ...JSON.parse(event.target.getAttribute("data-destination"))
              .coordinates,
          ].reverse();
          setStartPoint(depart);
          setEndPoint(destination);
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-screen">
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
        <RoutingMachine start={startPoint} end={endPoint} />

        {userLocation && radius && (
          <>
            <NearbyPoints
              center={userLocation}
              points={motelGeoJson?.features}
              maxDistance={radius / 1000} // max distance in kilometers
              handleClickFindRoute={handleClickFindRoute}
            />

            <Circle
              center={userLocation} // Center of the circle at user location
              radius={radius} // Radius in meters
              pathOptions={{
                color: "blue",
                fillColor: "#blue",
                fillOpacity: 0.4,
              }}
            />
          </>
        )}
      </MapContainer>

      <div className="absolute left-0 top-0">
        {currentRoom && (
          <Sheet open={open} onOpenChange={setOpen} className="p-0">
            <SheetContent side="left">
              <ScrollArea className="h-screen w-full">
                <SheetHeader>
                  <img
                    style={{ fontSize: "14px", color: "#6b7280" }}
                    src="https://github.com/shadcn.png"
                    // src={currentRoom.motel.images[0]}
                    alt="room image"
                    className="w-full h-72 object-cover mt-4"
                  />
                  <SheetTitle>{currentRoom.motel.name}</SheetTitle>
                  <SheetDescription>
                    {currentRoom.motel.description}
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-2">
                  <p>
                    <span>
                      <span className="font-semibold">Giá: </span>
                      {(currentRoom.price * 1000).toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </p>
                  <p className="mt-1">
                    <span>
                      <span className="font-semibold">Tình trạng: </span>
                      {currentRoom.isAvailable ? "Đang trống" : "Đã được thuê"}
                    </span>
                  </p>
                  <p className="mt-1">
                    <span>
                      <span className="font-semibold">Gác lửng: </span>
                      {currentRoom.isMezzanine ? "Có" : "Không"}
                    </span>
                  </p>

                  <div>
                    <h4 className="font-semibold">Hình ảnh:</h4>
                    <div className="flex flex-wrap gap-3">
                      {currentRoom.motel.images.map((img, index) => (
                        <img
                          key={index + "_image_key"}
                          // src={img}
                          src="https://github.com/shadcn.png"
                          alt="Hình ảnh nhà trọ"
                          className="w-40 h-40 object-cover"
                          onClick={() => handleClickImage(index)}
                        />
                      ))}
                    </div>
                  </div>

                  <LightGallery
                    onInit={onInit}
                    dynamic={true}
                    // plugins={[lgZoom, lgThumbnail]}
                    zoom={{ scale: 1.5, enableZoomAfter: 100 }}
                    dynamicEl={currentRoom?.motel?.images.map(
                      (image, index) => ({
                        // src: image.path,
                        // thumb: image.path,
                        src: "https://github.com/shadcn.png",
                        thumb: "https://github.com/shadcn.png",
                        subHtml: `<h4>Image ${index + 1} title</h4><p>Image ${
                          index + 1
                        } descriptions.</p>`,
                      })
                    )}
                  ></LightGallery>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <SearchBar className="absolute top-4 left-16" />

      <SearchResultPanel
        className="absolute top-16 left-16"
        handleClickFindRoute={handleClickFindRoute}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button className="absolute top-4 left-64">Tìm trong phạm vi</Button>
        </PopoverTrigger>
        <PopoverContent>
          <form
            onSubmit={handleClickFindInRadius}
            className="flex flex-col items-center"
          >
            <Input name="radius" placeholder="Bán kính" type="number" min="1" />
            <div className="flex gap-2 mt-4">
              <Button type="submit">Xác nhận</Button>

              <Button
                variant="secondary"
                type="button"
                onClick={(e) => setRadius(null)}
              >
                Hủy bán kính
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default HomePage;
