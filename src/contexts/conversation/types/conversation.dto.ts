import { IsString } from "class-validator";

export class ConversationDTO {
    @IsString()
    conversationId: string
}

export class CreateConversationDTO {
    @IsString()
    title: string
}

export class UpdateConversationDTO{
    @IsString()
    title: string

    @IsString()
    id: string
}