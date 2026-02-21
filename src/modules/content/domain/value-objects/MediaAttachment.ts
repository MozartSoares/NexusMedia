import { FileTooLargeError, InvalidMimeTypeError } from "../errors";
import { MimeType } from "./MimeType";

const EXTENSION_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export class MediaAttachment {
  private readonly _extension: string;
  private readonly _mimeType: MimeType;
  private readonly _filename: string;
  private readonly _size: number;

  private constructor(
    extension: string,
    mimeType: MimeType,
    filename: string,
    size: number,
  ) {
    this._extension = extension;
    this._mimeType = mimeType;
    this._filename = filename;
    this._size = size;
  }

  static create({
    filename: rawFilename,
    contentType,
    size,
  }: {
    filename: string;
    contentType: string;
    size: number;
  }) {
    const mimeType = MimeType.create(contentType);

    const dotIndex = rawFilename.lastIndexOf(".");
    const ext =
      dotIndex > 0 ? rawFilename.slice(dotIndex + 1).toLowerCase() : "";
    if (!ext || EXTENSION_TO_MIME[ext] !== contentType) {
      throw new InvalidMimeTypeError();
    }

    const sanitized =
      rawFilename
        .slice(0, dotIndex)
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 64) || "file";

    if (size > MAX_FILE_SIZE) {
      throw new FileTooLargeError(MAX_FILE_SIZE);
    }

    return new MediaAttachment(ext, mimeType, sanitized, size);
  }

  get extension(): string {
    return this._extension;
  }

  get mimeType(): string {
    return this._mimeType.value;
  }

  get size(): number {
    return this._size;
  }

  get filename(): string {
    return this._filename;
  }
}
