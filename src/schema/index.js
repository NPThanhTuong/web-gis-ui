import { latLng } from "leaflet";
import * as z from "zod";

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Vui lòng nhập địa chỉ email hợp lệ",
    }),
    name: z.string().min(3, {
      message: "Vui lòng nhập tên của bạn",
    }),
    phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, {
      message: "Vui lòng nhập số điện thoại hợp lệ",
    }),
    password: z
      .string()
      .min(8, {
        message: "Mật khẩu phải dài ít nhất 8 ký tự",
      })
      .max(20, { message: "Mật khẩu không vượt quá 20 ký tự" }),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Mật khẩu phải dài ít nhất 8 ký tự",
      })
      .max(20, { message: "Mật khẩu không vượt quá 20 ký tự" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Error path
    message: "Mật khẩu xác nhận không khớp",
  });

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Vui lòng nhập địa chỉ email hợp lệ",
  }),
  password: z
    .string()
    .min(8, {
      message: "Mật khẩu phải dài ít nhất 8 ký tự",
    })
    .max(20, { message: "Mật khẩu không vượt quá 20 ký tự" }),
});

export const CreateMotelSchema = z.object({
  name: z.string().min(1, {
    message: "Vui lòng nhập tên nhà trọ",
  }),
  description: z.string().min(1, {
    message: "Vui lòng nhập mô tả nhà trọ",
  }),
});
