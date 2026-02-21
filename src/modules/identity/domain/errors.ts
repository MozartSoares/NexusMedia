import { AppError } from "@/shared/errors";

export class UserAlreadyExistsError extends AppError {
  constructor(field: string) {
    super(`User already exists with this ${field}.`, "USER_ALREADY_EXISTS");
  }
}
export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid email or password combination.", "INVALID_CREDENTIALS");
  }
}
export class InvalidEmailError extends AppError {
  constructor() {
    super("Invalid email format.", "INVALID_EMAIL");
  }
}

export class InvalidPasswordError extends AppError {
  constructor() {
    super("Password must be at least 8 characters long.", "INVALID_PASSWORD");
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super("Unauthorized access.", "UNAUTHORIZED");
  }
}

export class InvalidUsernameError extends AppError {
  constructor() {
    super("Username must be at least 3 characters long.", "INVALID_USERNAME");
  }
}
