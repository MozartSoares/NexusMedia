import { Post, type PostProps } from "../entities";
import { MimeType } from "../value-objects/MimeType";
import { TagName } from "../value-objects/TagName";
import { Title } from "../value-objects/Title";

export class PostFactory {
  static create(props: Omit<PostProps, "created_at">, id: string): Post {
    const titleVO = Title.create(props.title);
    const mimeTypeVO = MimeType.create(props.mime_type);
    const tags = props.tags.map((tag) => TagName.create(tag).value);

    return new Post(
      {
        ...props,
        title: titleVO.value,
        mime_type: mimeTypeVO.value,
        tags,
      },
      id,
    );
  }

  static restore(props: PostProps, id: string): Post {
    return new Post(props, id);
  }
}
