import { AppError } from "@/shared";

export class InvalidCursorError extends AppError {
  constructor() {
    super("Invalid or malformed cursor", "INVALID_CURSOR");
  }
}