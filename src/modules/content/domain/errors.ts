import { AppError } from "@/shared/errors";

export class InvalidTitleError extends AppError {
  constructor() {
    super("Title must be between 1 and 120 characters.", "INVALID_TITLE");
  }
}

export class InvalidMimeTypeError extends AppError {
  constructor() {
    super(
      "Unsupported file type. Allowed: jpeg, png, webp, gif.",
      "INVALID_MIME_TYPE",
    );
  }
}

export class InvalidTagNameError extends AppError {
  constructor() {
    super(
      "Tag must be 1-30 characters, lowercase alphanumeric and hyphens only.",
      "INVALID_TAG_NAME",
    );
  }
}

export class FileTooLargeError extends AppError {
  constructor(maxSizeBytes: number) {
    const maxMB = Math.round(maxSizeBytes / (1024 * 1024));
    super(`File size exceeds maximum allowed (${maxMB}MB).`, "FILE_TOO_LARGE");
  }
}

export class FileNotFoundError extends AppError {
  constructor() {
    super("Uploaded file not found in storage.", "FILE_NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "User is not authorized to perform this action.") {
    super(message, "UNAUTHORIZED");
  }
}

export class InvalidStoragePathError extends AppError {
  constructor() {
    super("Invalid storage path format.", "INVALID_STORAGE_PATH");
  }
}

export class UnauthorizedStoragePathError extends AppError {
  constructor() {
    super("Unauthorized to access storage path.", "UNAUTHORIZED_STORAGE_PATH");
  }
}

export class FileProcessingError extends AppError {
  constructor() {
    super("Failed to process uploaded file.", "FILE_PROCESSING_FAILED");
  }
}
