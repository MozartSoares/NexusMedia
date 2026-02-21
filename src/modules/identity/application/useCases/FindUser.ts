import { IUserRepository } from "../../domain";
import { UserDto } from "../dtos";
import { UserMapper } from "../mappers/UserMapper";

export class FindUser {
    constructor(private userRepository: IUserRepository) {}
    async execute(id: string): Promise<UserDto | null> {
        const user = await this.userRepository.findById(id);
        if (!user) return null;
        return UserMapper.toDTO(user);
    }
}