import { Expose } from "class-transformer"
import { IsBoolean, IsString } from "class-validator"

export class RscGroupePresenter {
    @Expose()
    @IsString()
    groupeTitle: string

    @Expose()
    @IsString()
    groupeDescription: string

    @Expose()
    @IsString()
    groupeImage: string

    @Expose()
    @IsString()
    membreUsername: string[]

    @Expose()
    @IsBoolean()
    isPublic: Boolean

}