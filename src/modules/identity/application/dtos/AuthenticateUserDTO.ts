import { z } from "zod";
import { UserDto } from "./UserDto";

export const AuthenticateUserSchema = z.object({
  email: z.email("Invalid email format"),
  password_plain: z.string().min(8, "Password must have at least 8 characters"),
});

export interface AuthenticateUserRequestDTO extends z.infer<typeof AuthenticateUserSchema> {}

export interface AuthenticateUserResponseDTO {
  user: UserDto;
  token: string;
}