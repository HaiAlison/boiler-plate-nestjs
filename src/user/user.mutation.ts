import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "src/entities/user.entity";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/user.dto"

@Resolver(() => User)
export class UserMutation {
    constructor(
        private readonly userService: UserService,
    ) { }
    @Mutation(() => User)
    async createUser(@Args('input') input: CreateUserDto): Promise<User> {
        return this.userService.createUser(input);
    }
}