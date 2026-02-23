import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { ConversationEntity } from "./entities/conversation.entities";
import { ConversationDTO, CreateConversationDTO, UpdateConversationDTO } from "./types/conversation.dto";


@Controller("conversation")
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}
    @Get()
    getConversations(){
        // Envoie la liste des discussions de l'utilisateur
    }


    @Post()
    @HttpCode(HttpStatus.OK)
    createConversation(@Body() body: CreateConversationDTO): Promise<ConversationEntity>{
        // Crée une nouvelle discussion
        console.log("test")
        return this.conversationService.createConversation(body.title);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    updateConversation(@Body() body: UpdateConversationDTO): Promise<ConversationEntity | any>{
        return this.conversationService.updateConversation(body)
    }

    @Get("/:id")
    getConversationById(@Param("id") id: string): Promise<ConversationEntity | null>{
        return this.conversationService.findConversationById(id)
    }
}