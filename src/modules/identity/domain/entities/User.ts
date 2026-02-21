export interface UserProps {
  email: string;
  username: string;
  password_hash: string;
  created_at?: Date;
}

export class User {
private _id: string;
  private props: UserProps;

  constructor(props: UserProps, id: string) {
    this._id = id;
    this.props = {
      ...props,
      created_at: props.created_at ?? new Date(),
    };
  }

  get id() { return this._id; }
  get email() { return this.props.email; }
  get username() { return this.props.username; }
  get password_hash() { return this.props.password_hash; }
  get created_at() { return this.props.created_at; }
}