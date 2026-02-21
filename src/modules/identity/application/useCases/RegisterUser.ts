import { RegisterUserRequestDTO, RegisterUserResponseDTO, RegisterUserSchema } from "../dtos";
import { IHashProvider,IUserRepository, Password } from "../../domain";
import { UserFactory } from "../factories/UserFactory";
import { UserMapper } from "../mappers/UserMapper";


export class RegisterUser {
  constructor(private userRepository: IUserRepository, private hashProvider: IHashProvider) {}

  async execute(data: RegisterUserRequestDTO): Promise<RegisterUserResponseDTO> {
    // 1. Validate DTO with Zod
    const validatedData = RegisterUserSchema.parse(data);

    // 3. Verify if email or username is already being used
    const [emailExists,usernameExists] = await Promise.all([
      this.userRepository.findByEmail(validatedData.email),
      this.userRepository.findByUsername(validatedData.username)
    ]);
    if (emailExists) {
      throw new Error("User already exists with this email.");
    }
    if (usernameExists) {
      throw new Error("User already exists with this username.");
    }

    // 4. Hash the password
    const passwordVO = Password.create(validatedData.password_plain);
    const password_hash = await this.hashProvider.hash(passwordVO.getValue);

    // 5. Create the entity and persist
    const newUser = UserFactory.create({
      email: validatedData.email,
      username: validatedData.username,
      password_hash
    });

    const user = await this.userRepository.save(newUser);

    return UserMapper.toDTO(user);
  }
}