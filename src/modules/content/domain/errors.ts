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
