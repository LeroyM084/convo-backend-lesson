import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { AuthModule } from "../auth/auth.module";
import { AuthGuard } from "../../core/guards/auth.guard";
import { PermissionsGuard } from "../../core/permissions/guards/permissions.guard";

@Module({
    imports: [AuthModule],
    controllers: [ProfileController],
    providers: [ProfileService, AuthGuard, PermissionsGuard],
})
export class ProfileModule { }