import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { LoginDTO, RegisterDTO } from "./types/auth.dto";
import { UserLoggerPresenter } from "./types/auth.presenter";
import { plainToInstance } from "class-transformer";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() body: LoginDTO){
        return this.authService.login(body);
    }
    @Post("register")
    @HttpCode(HttpStatus.OK)
    register(@Body() body: RegisterDTO): Promise<string | boolean> {
        return this.authService.register(body);
    }
}