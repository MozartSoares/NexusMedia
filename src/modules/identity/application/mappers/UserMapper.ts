import type { User } from "../../domain";
import type { UserDto } from "../dtos";

export class UserMapper {
  static toDTO(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
