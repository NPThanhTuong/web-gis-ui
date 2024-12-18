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

function UpdateMotelForm({
  id,
  name,
  description,
  lat,
  lng,
  setOpenUpdateMotelDialog,
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(CreateMotelSchema),
    defaultValues: {
      name,
      description,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    let dataSubmit;
    try {
      if (lat && lng) {
        dataSubmit = {
          userId: 1, // 1 is id of no user
          ...data,
          geom: JSON.stringify({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  coordinates: [lng, lat],
                  type: "Point",
                },
              },
            ],
          }),
        };
      } else {
        dataSubmit = {
          userId: 1, // 1 is id of no user
          ...data,
        };
      }

      const res = await axiosInstance.put("Motels/" + id, dataSubmit);

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin nhà trọ đã được hệ thống ghi nhận",
      });

      setOpenUpdateMotelDialog(false);
    } catch (error) {
      console.log(error);
    }
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
                  <FormLabel>Tên</FormLabel>
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
                  <FormLabel>Mô tả</FormLabel>
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
          </div>
          <Button type="submit" className="w-full">
            {loading ? "Đang tải..." : "Lưu"}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default UpdateMotelForm;
