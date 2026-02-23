import { Controller, Get, Param, Body, Post, HttpCode, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageDTO } from "./types/message.dto";
import { AuthGuard } from "../../core/guards/auth.guard";

@Controller("message")
export class MessageController {
    constructor(private readonly messageService: MessageService) {}
    
    @Post("send")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async postMessage(@Body() body: MessageDTO, @Req() request: any) {
        const userId = request.user?.id;
        
        return await this.messageService.sendMessage(
            body.content,
            userId,
            body.conversationId
        );
    }

    @Get("conversation/:conversationId")
    @UseGuards(AuthGuard)
    async getConversationMessages(@Param("conversationId") conversationId: string) {
        return await this.messageService.getConversationMessages(conversationId);
    }
}