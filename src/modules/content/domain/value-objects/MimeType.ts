import { InvalidMimeTypeError } from "../errors";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export class MimeType {
  private readonly _value: AllowedMimeType;

  private constructor(mimeType: AllowedMimeType) {
    this._value = mimeType;
  }

  static create(mimeType: string): MimeType {
    if (!MimeType.validate(mimeType)) throw new InvalidMimeTypeError();
    return new MimeType(mimeType as AllowedMimeType);
  }

  static validate(mimeType: string): boolean {
    return (ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
  }

  get value(): string {
    return this._value;
  }
}
