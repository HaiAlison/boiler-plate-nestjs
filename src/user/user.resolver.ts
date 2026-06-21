
import { User } from "../entities/user.entity";
import { Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";

@Resolver(() => User)

export class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return this.userService.getUsers();
    }
}