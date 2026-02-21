export interface AuthenticateUserRequestDTO {
  email: string;
  password_plain: string;
}

export interface AuthenticateUserResponseDTO {
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
}