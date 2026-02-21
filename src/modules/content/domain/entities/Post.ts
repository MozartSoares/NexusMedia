export type PostStatus = "PROCESSING" | "PUBLISHED" | "FAILED";

export interface PostProps {
  title: string;
  storage_path: string;
  filename: string;
  author_id: string;
  size: number;
  tags: string[];
  mime_type: string;
  status: PostStatus;
  created_at?: Date;
}

export class Post {
  private _id: string;
  private props: PostProps;

  constructor(props: PostProps, id: string) {
    this._id = id;
    this.props = {
      ...props,
      created_at: props.created_at ?? new Date(),
    };
  }

  get id() {
    return this._id;
  }

  get title() {
    return this.props.title;
  }

  get storage_path() {
    return this.props.storage_path;
  }

  get filename() {
    return this.props.filename;
  }

  get author_id() {
    return this.props.author_id;
  }

  get size() {
    return this.props.size;
  }

  get tags() {
    return this.props.tags;
  }

  get mime_type() {
    return this.props.mime_type;
  }

  get status() {
    return this.props.status;
  }

  get created_at() {
    return this.props.created_at;
  }

  updateStatus(status: PostStatus) {
    this.props.status = status;
  }
}
