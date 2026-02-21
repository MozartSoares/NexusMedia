import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";
import { RegisterUserRequestDTO, RegisterUserResponseDTO } from "../dtos";
import { IHashProvider } from "../../domain/interfaces/IHashProvider";
import { UserFactory } from "../factories/UserFactory";


export class RegisterUser {
  constructor(private userRepository: IUserRepository, private hashProvider: IHashProvider) {}

  async execute(data: RegisterUserRequestDTO): Promise<RegisterUserResponseDTO> {
    // 1. Verify if email or username is already being used
    const [emailExists,usernameExists] = await Promise.all([
      this.userRepository.findByEmail(data.email),
      this.userRepository.findByUsername(data.username)
    ]);
    if (emailExists) {
      throw new Error("User already exists with this email.");
    }
    if (usernameExists) {
      throw new Error("User already exists with this username.");
    }

    // 2. Hash the password
    const password_hash = await this.hashProvider.hash(data.password_plain); 

    // 3. Create the entity and persist
    const newUser = UserFactory.create({
      email: data.email,
      username: data.username,
      password_hash
    });

    const user = await this.userRepository.save(newUser);

    return {
      id: user.id,
      email: user.email,
      username: user.username
    };
  }
}