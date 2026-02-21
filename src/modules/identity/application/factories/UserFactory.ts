import { generateUserId } from "@/shared/idGenerator";
import { User, UserProps,Email,Password } from "../../domain";

export class UserFactory {
  static create(props: Omit<UserProps, 'created_at'>): User {
    const id = generateUserId();
    const created_at = new Date();
    const emailVO = Email.create(props.email);
    
    return new User({
      ...props,
      email: emailVO.getValue,
      created_at
    }, id);
  }

  static restore(props: UserProps, id: string): User {
    return new User(props, id);
  }
}