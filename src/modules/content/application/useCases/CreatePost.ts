import { createEntityId } from "@/shared/idGenerator";
import {
  FileNotFoundError,
  FileProcessingError,
  type IPostRepository,
  type IStorageProvider,
  type IUploadTokenProvider,
  MediaAttachment,
  PostFactory,
  StoragePath,
  UnauthorizedError,
} from "../../domain";
import {
  type CreatePostRequestDTO,
  type CreatePostResponseDTO,
  CreatePostSchema,
} from "../dtos";
import { PostMapper } from "../mappers/PostMapper";

export class CreatePost {
  constructor(
    private postRepository: IPostRepository,
    private storageProvider: IStorageProvider,
    private tokenProvider: IUploadTokenProvider,
  ) {}

  async execute({
    data,
    userId,
  }: {
    data: CreatePostRequestDTO;
    userId: string;
  }): Promise<CreatePostResponseDTO> {
    const validated = CreatePostSchema.parse(data);

    const tokenPayload = this.tokenProvider.verifyToken(validated.uploadToken);

    if (!tokenPayload || tokenPayload.userId !== userId) {
      throw new UnauthorizedError("Invalid or expired upload token.");
    }

    const fileKey = tokenPayload.fileKey;

    const tempPath = StoragePath.create(fileKey);
    tempPath.validateOwnership(userId);

    let metadata: { size: number; contentType: string; filename: string };
    try {
      metadata = await this.storageProvider.getFileMetadata(fileKey);
    } catch {
      throw new FileNotFoundError();
    }

    MediaAttachment.validateSize(metadata.size);

    const permanentPath = tempPath.toPermanent();

    const id = createEntityId();
    const post = PostFactory.create(
      {
        title: validated.title,
        storage_path: permanentPath.value,
        filename: metadata.filename,
        author_id: userId,
        size: metadata.size,
        tags: validated.tags,
        mime_type: metadata.contentType,
        status: "PROCESSING",
      },
      id,
    );

    const saved = await this.postRepository.save(post);

    try {
      await this.storageProvider.moveFile({
        sourceKey: tempPath.value,
        destinationKey: permanentPath.value,
      });

      await this.postRepository.updateStatus(saved.id, "PUBLISHED");
      saved.updateStatus("PUBLISHED");
    } catch {
      await this.postRepository.updateStatus(saved.id, "FAILED");
      throw new FileProcessingError();
    }

    return {
      post: PostMapper.toDTO(
        saved,
        this.storageProvider.getPublicUrl(saved.storage_path),
      ),
    };
  }
}
