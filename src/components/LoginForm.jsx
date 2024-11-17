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
import { useEffect, useState } from "react";
import CardWrapper from "@/components/CardWrapper";
import { LoginSchema } from "@/schema";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const { email, password } = data;
    await login(email, password);
  };

  useEffect(() => {
    if (error) setLoading(false);
  }, [error]);

  return (
    <CardWrapper
      label="Đăng nhập vào tài khoản của bạn"
      title="Đăng nhập"
      backButtonHref="/register"
      backButtonLabel="Bạn chưa có tài khoản? Đăng ký ngay."
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
                      placeholder="vd: abc@gmail.com"
                      autoComplete="username"
                    />
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
          </div>
          {error && <p className="text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            {loading ? "Đang tải..." : "Đăng nhập"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default LoginForm;
