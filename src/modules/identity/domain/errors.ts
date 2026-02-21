import { AppError } from "@/shared/errors/AppError";

export class UserAlreadyExistsError extends AppError {
  constructor(field: string) {
    super(`User already exists with this ${field}.`, 'USER_ALREADY_EXISTS');
  }
}
export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid email or password combination.', 'INVALID_CREDENTIALS');
  }
}