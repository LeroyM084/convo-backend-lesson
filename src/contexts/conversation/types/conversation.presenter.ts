import { Expose } from "class-transformer"
import { IsString } from "class-validator"


export class ConversationPresenter {

    @Expose()
    @IsString()
    conversationHistory: string[]

    @Expose()
    @IsString()
    conversationId: string

    @Expose()
    @IsString()
    title: string
}