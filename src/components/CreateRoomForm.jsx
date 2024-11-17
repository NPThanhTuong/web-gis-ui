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
import { CreateRoomSchema } from "@/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/configs/axiosConfig";
import { toast, useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

function CreateRoomForm({ feature, setOpenCreateRoomDialog }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(CreateRoomSchema),
    defaultValues: {
      price: "",
      capability: "",
      isMezzanine: false,
      isAvailable: true,
      description: "",
      motelId: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("Rooms", {
        ...data,
        geom: JSON.stringify({
          type: "FeatureCollection",
          features: [feature],
        }),
      });

      toast({
        title: "Thêm mới thành công",
        description: "Thông tin phòng trọ đã được hệ thống ghi nhận",
      });

      setOpenCreateRoomDialog(false);
      navigate(0);
    } catch (error) {
      if (error.status === 404)
        toast({
          title: "Thất bại!",
          description: "Thêm phòng trọ mới thất bại. Không tìm thấy nhà trọ.",
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá (.000đ):</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="vd: 2000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sức chứa:</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="vd: 1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="motelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã nhà trọ:</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="vd: 1" />
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
                      placeholder="Một số mô tả ngắn gọn về phòng trọ..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isMezzanine"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Phòng trọ có gác lửng</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Phòng trọ đang trống</FormLabel>
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

export default CreateRoomForm;
