import { faker } from "@faker-js/faker";
import type { User } from "../../../../domain";

export const createMockUser = (overrides?: Partial<User>): User => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    username: faker.internet.username(),
    password_hash: faker.string.alphanumeric(60),
    created_at: faker.date.recent(),
    ...overrides,
  } as User;
};
