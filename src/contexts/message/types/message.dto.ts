import { Transform } from "class-transformer"
import { IsString } from "class-validator"

export class MessageDTO {
    @IsString()
    content: string

    @IsString()
    conversationId: string

}
