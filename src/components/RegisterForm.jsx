import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CardWrapper from "@/components/CardWrapper";
import { RegisterSchema } from "@/schema";
import { axiosInstance } from "@/configs/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/Auth/register", {
        email: data.email,
        name: data.name,
        phone: data.phone,
        password: data.password,
      });

      toast({
        title: "Đăng ký thành công!",
        description: "Đăng ký tài khoản thành công. Đăng nhập ngay!",
      });

      navigate("/login");
    } catch (error) {
      console.log(error);
      toast({
        title: "Thất bại",
        description: error.response.data.message,
      });
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      label="Tạo tài khoản mới"
      title="Đăng ký"
      backButtonHref="/login"
      backButtonLabel="Bạn đã có tài khoản? Đăng nhập ngay."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="vd: hoanghuy@gmail.com"
                      autoComplete="username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="vd: Hoang Huy" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0829478580" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="******"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu xác nhận</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="******"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            {loading ? "Đang tải..." : "Đăng ký"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default RegisterForm;
