export interface RegisterUserRequestDTO {
  email: string;
  username: string;
  password_plain: string;
}

export interface RegisterUserResponseDTO {
  id: string;
  email: string;
  username: string;
}