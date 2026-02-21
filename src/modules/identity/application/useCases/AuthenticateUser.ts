import {
  type IHashProvider,
  InvalidCredentialsError,
  type ITokenProvider,
  type IUserRepository,
} from "../../domain";
import {
  type AuthenticateUserRequestDTO,
  type AuthenticateUserResponseDTO,
  AuthenticateUserSchema,
} from "../dtos";
import { UserMapper } from "../mappers/UserMapper";

export class AuthenticateUser {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider,
    private tokenProvider: ITokenProvider,
  ) {}

  async execute(
    data: AuthenticateUserRequestDTO,
  ): Promise<AuthenticateUserResponseDTO> {
    const validatedData = AuthenticateUserSchema.parse(data);

    const user = await this.userRepository.findByEmail(validatedData.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.hashProvider.compare(
      validatedData.password_plain,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.tokenProvider.generateToken({
      sub: user.id,
      username: user.username,
    });

    return {
      user: UserMapper.toDTO(user),
      token,
    };
  }
}
