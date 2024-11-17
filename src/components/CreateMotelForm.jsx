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

function CreateMotelForm({ feature, setOpenCreateMotelDialog }) {
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
    try {
      setLoading(true);

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

export default CreateMotelForm;
