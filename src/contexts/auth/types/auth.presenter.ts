import { Expose } from "class-transformer"
import { IsString } from "class-validator"


export class UserLoggerPresenter {
    @Expose()
    @IsString()
    username: string
}