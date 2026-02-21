import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { IHashProvider } from "../../domain/interfaces/IHashProvider";
import { ITokenProvider } from "../../domain/interfaces/ITokenProvider";
import { AuthenticateUserRequestDTO, AuthenticateUserResponseDTO } from "../dtos/AuthenticateUserDTO";

export class AuthenticateUser {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider,
    private tokenProvider: ITokenProvider
  ) {}

  async execute(data: AuthenticateUserRequestDTO): Promise<AuthenticateUserResponseDTO> {
    // 1. Validate if user exists
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password."); 
    }

    // 2. Validate password
    const isPasswordValid = await this.hashProvider.compare(
      data.password_plain, 
      user.password_hash
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // 3. Generate token (Stateless Auth)
    const token = this.tokenProvider.generateToken({ sub: user.id, username: user.username });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token
    };
  }
}