import { createEntityId } from "@/shared/idGenerator";
import {
  type IHashProvider,
  type IUserRepository,
  Password,
  UserAlreadyExistsError,
  UserFactory,
} from "../../domain";
import {
  type RegisterUserRequestDTO,
  type RegisterUserResponseDTO,
  RegisterUserSchema,
} from "../dtos";
import { UserMapper } from "../mappers/UserMapper";

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider,
  ) {}

  async execute(
    data: RegisterUserRequestDTO,
  ): Promise<RegisterUserResponseDTO> {
    const validatedData = RegisterUserSchema.parse(data);

    const [emailExists, usernameExists] = await Promise.all([
      this.userRepository.findByEmail(validatedData.email),
      this.userRepository.findByUsername(validatedData.username),
    ]);
    if (emailExists) {
      throw new UserAlreadyExistsError("email");
    }
    if (usernameExists) {
      throw new UserAlreadyExistsError("username");
    }

    const passwordVO = Password.create(validatedData.password_plain);
    const password_hash = await this.hashProvider.hash(passwordVO.value);

    const id = createEntityId();
    const newUser = UserFactory.create(
      {
        email: validatedData.email,
        username: validatedData.username,
        password_hash,
      },
      id,
    );

    const user = await this.userRepository.save(newUser);

    return UserMapper.toDTO(user);
  }
}
