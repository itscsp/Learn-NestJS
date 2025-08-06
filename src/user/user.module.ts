import { UserController } from "@/src/user/user.controller";
import { UserService } from "@/src/user/user.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [UserController],
    providers: [UserService],
})
export class UsetModule {}