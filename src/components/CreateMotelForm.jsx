import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMotelSchema } from "@/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/configs/axiosConfig";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateMotelForm({ feature, setOpenCreateMotelDialog }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(CreateMotelSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    const uploadPromises = selectedImages.map((image) => {
      const formData = new FormData();
      formData.append("file", image.file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
      formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

      return axios.post(
        "https://api.cloudinary.com/v1_1/dmcqr73g4/image/upload",
        formData
      );
    });

    try {
      setLoading(true);
      const resCloudinary = await Promise.all(uploadPromises);
      const uploadedUrls = resCloudinary.map((response) => ({
        path: response.data.secure_url,
      }));

      const dataSubmit = {
        userId: 1, // 1 is id of no user
        name: data.name,
        description: data.description,
        geom: JSON.stringify({
          type: "FeatureCollection",
          features: [feature],
        }),
      };

      const res = await axiosInstance.post("Motels", dataSubmit);

      console.log({ uploadedUrls });
      if (uploadedUrls.length > 0) {
        const res2 = await axiosInstance.post(
          `Motels/${res.data.id}/images`,
          uploadedUrls
        );
      }

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin nhà trọ đã được hệ thống ghi nhận",
      });

      setOpenCreateMotelDialog(false);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    // Convert files to preview-able URLs
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên nhà trọ:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="vd: Nhà trọ ABC"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả:</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Một số mô tả ngắn gọn về nhà trọ..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình ảnh:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Image Previews */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`Preview ${index}`}
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            {loading ? "Đang tải..." : "Lưu"}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default CreateMotelForm;
