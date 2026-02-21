import { RegisterUserRequestDTO, RegisterUserResponseDTO, RegisterUserSchema } from "../dtos";
import { IHashProvider,IUserRepository, Password } from "../../domain";
import { UserFactory } from "../factories/UserFactory";
import { UserMapper } from "../mappers/UserMapper";
import { UserAlreadyExistsError } from "../../domain/errors";


export class RegisterUser {
  constructor(private userRepository: IUserRepository, private hashProvider: IHashProvider) {}

  async execute(data: RegisterUserRequestDTO): Promise<RegisterUserResponseDTO> {
    const validatedData = RegisterUserSchema.parse(data);

    const [emailExists,usernameExists] = await Promise.all([
      this.userRepository.findByEmail(validatedData.email),
      this.userRepository.findByUsername(validatedData.username)
    ]);
    if (emailExists) {
      throw new UserAlreadyExistsError("email");
    }
    if (usernameExists) {
      throw new UserAlreadyExistsError("username");
    }

    const passwordVO = Password.create(validatedData.password_plain);
    const password_hash = await this.hashProvider.hash(passwordVO.getValue);

    const newUser = UserFactory.create({
      email: validatedData.email,
      username: validatedData.username,
      password_hash
    });

    const user = await this.userRepository.save(newUser);

    return UserMapper.toDTO(user);
  }
}