import { generateUserId } from "@/shared/idGenerator";
import { User, UserProps } from "../../domain/entities/User";

export class UserFactory {
  static create(props: Omit<UserProps, 'created_at'>): User {
    const id = generateUserId();
    const created_at = new Date();
    
    return new User({
      ...props,
      created_at
    }, id);
  }

  static restore(props: UserProps, id: string): User {
    return new User(props, id);
  }
}