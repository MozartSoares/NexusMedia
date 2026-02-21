import { User, type UserProps } from "../entities";
import { Email } from "../value-objects/Email";
import { Username } from "../value-objects/Username";

export class UserFactory {
  static create(props: Omit<UserProps, "created_at">, id: string): User {
    const emailVO = Email.create(props.email);
    const usernameVO = Username.create(props.username);

    return new User(
      {
        ...props,
        email: emailVO.value,
        username: usernameVO.value,
      },
      id,
    );
  }

  static restore(props: UserProps, id: string): User {
    return new User(props, id);
  }
}
