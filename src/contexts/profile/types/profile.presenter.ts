import { Expose } from "class-transformer"
import { IsNumber, IsString } from "class-validator"


export class ProfileLoggerPresenter {
    @Expose()
    @IsString()
    username: string
    @Expose()
    @IsString()
    profilePicture: string
}