import { Controller, Get, HttpStatus, Param, Put, HttpCode, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { RequirePermissions } from "../../core/permissions/decorators/require-permissions.decorator";
import { PROFILE_UPDATE } from "../../core/permissions/permissions.constants";
import { PermissionsGuard } from "../../core/permissions/guards/permissions.guard";
import { AuthGuard } from "../../core/guards/auth.guard";

@Controller("profile")
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }
    @Get(":id")
    getProfile(@Param('id') id: string): string {
        console.log('Received request for profile with id:', id);
        return this.profileService.getProfile(id);
    }
    @Put("me")
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(PROFILE_UPDATE)
    @HttpCode(HttpStatus.OK)
    updateMyProfile() {
        // Met à jour le profil de l'utilisateur connecté
    }
}