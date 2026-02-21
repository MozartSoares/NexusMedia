import { IUserRepository, IHashProvider, ITokenProvider,Email,Password } from "../../domain";
import { AuthenticateUserRequestDTO, AuthenticateUserResponseDTO, AuthenticateUserSchema } from "../dtos";
import { UserMapper } from "../mappers/UserMapper";

export class AuthenticateUser {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider,
    private tokenProvider: ITokenProvider
  ) {}

  async execute(data: AuthenticateUserRequestDTO): Promise<AuthenticateUserResponseDTO> {
    // 1. Validate DTO with Zod
    const validatedData = AuthenticateUserSchema.parse(data);

    // 3. Validate if user exists
    const user = await this.userRepository.findByEmail(validatedData.email);
    if (!user) {
      throw new Error("Invalid email or password."); 
    }

    // 4. Validate password
    const isPasswordValid = await this.hashProvider.compare(
      validatedData.password_plain, 
      user.password_hash
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // 5. Generate token (Stateless Auth)
    const token = this.tokenProvider.generateToken({ sub: user.id, username: user.username });

    return {
      user: UserMapper.toDTO(user),
      token
    };
  }
}