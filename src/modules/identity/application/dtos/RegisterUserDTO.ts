import { z } from "zod";
import { UserDto } from "./UserDto";

export const RegisterUserSchema = z.object({
  email: z.email("Invalid email format"),
  username: z.string().min(3, "Username must have at least 3 characters"),
  password_plain: z.string().min(8, "Password must have at least 8 characters"),
});

export interface RegisterUserRequestDTO extends z.infer<typeof RegisterUserSchema> {}

export type RegisterUserResponseDTO = UserDto;