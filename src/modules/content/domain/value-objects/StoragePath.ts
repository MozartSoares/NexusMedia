import { createRandomId } from "@/shared/idGenerator";
import {
  InvalidStoragePathError,
  UnauthorizedStoragePathError,
} from "../errors";

export class StoragePath {
  private constructor(private readonly _value: string) {}

  static create(path: string): StoragePath {
    if (!path.startsWith("temp/posts/") && !path.startsWith("uploads/posts/")) {
      throw new InvalidStoragePathError();
    }
    return new StoragePath(path);
  }

  static build({
    prefix,
    userId,
    extension,
  }: {
    prefix: "temp" | "uploads";
    userId: string;
    extension: string;
  }): StoragePath {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const path = `${prefix}/posts/${userId}/${year}/${month}/${day}/${createRandomId()}.${extension}`;
    return new StoragePath(path);
  }

  toPermanent(): StoragePath {
    const permanentValue = this._value.replace(/^temp\//, "uploads/");
    return new StoragePath(permanentValue);
  }

  validateOwnership(userId: string) {
    const segments = this._value.split("/");
    const pathUserId = segments[2];

    if (pathUserId !== userId) {
      throw new UnauthorizedStoragePathError();
    }
  }

  get value(): string {
    return this._value;
  }
}
