import { IsEmail, IsString, IsStrongPassword } from "class-validator"

export class LoginDTO {
    @IsEmail()
    email: string
    @IsStrongPassword()
    password: string
}

export class RegisterDTO {
    @IsEmail()
    email: string
    @IsStrongPassword()
    password: string
    @IsString()
    username: string
}