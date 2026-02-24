import { Controller, Get, Param, Body, Post, HttpCode, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageDTO } from "./types/message.dto";
import { AuthGuard } from "../../core/guards/auth.guard";
import { PermissionsGuard } from "../../core/permissions/guards/permissions.guard";
import { RequirePermissions } from "../../core/permissions/decorators/require-permissions.decorator";
import { MESSAGE_CREATE, MESSAGE_READ } from "../../core/permissions/permissions.constants";

@Controller("message")
export class MessageController {
    constructor(private readonly messageService: MessageService) {}
    
    @Post("send")
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(MESSAGE_CREATE)
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
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(MESSAGE_READ)
    async getConversationMessages(
        @Param("conversationId") conversationId: string,
        @Req() request: any
    ) {
        const userId = request.user?.id;
        return await this.messageService.markConversationMessagesAsReadForUser(
            conversationId,
            userId
        );
    }
}