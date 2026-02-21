import { UserFactory } from "../../application/factories/UserFactory";
import { User,IUserRepository } from "../../domain";
import { PrismaClient } from "@/generated/prisma";

export class PrismaUserRepository implements IUserRepository {
    constructor(private prisma: PrismaClient) {}
    async findByEmail(email: string): Promise<User | null> {
    const userRaw = await this.prisma.user.findUnique({ where: { email } });
    
    if (!userRaw) return null;

    return UserFactory.restore({
      email: userRaw.email,
      username: userRaw.username,
      password_hash: userRaw.password_hash,
      created_at: userRaw.created_at
    }, userRaw.id);
  }
    async findByUsername(username: string): Promise<User | null> {
      const userRaw = await this.prisma.user.findUnique({ where: { username } });

      if (!userRaw) return null;

      return UserFactory.restore({
        email: userRaw.email,
        username: userRaw.username,
        password_hash: userRaw.password_hash,
        created_at: userRaw.created_at
      }, userRaw.id);
    }
    async findById(id: string): Promise<User | null> {
      const userRaw = await this.prisma.user.findUnique({ where: { id } });
      if (!userRaw) return null;
      return UserFactory.restore({
        email: userRaw.email,
        username: userRaw.username,
        password_hash: userRaw.password_hash,
        created_at: userRaw.created_at
      }, userRaw.id);
    }
    async save(user: User): Promise<User> {
      await this.prisma.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email,
          username: user.username,
          password_hash: user.password_hash
        },
        create: {
          id: user.id,
          email: user.email,
          username: user.username,
          password_hash: user.password_hash,
          created_at: user.created_at
        }
      });

      return user;
    }
}