import { DomainError } from "src/core/errors/domain-error";

export class PlayerNotFoundError extends DomainError{
    public readonly fields: Record<string, string[]>;
    constructor(params: {
        fields: Record<string, string[]>
        }) {
        super({
            code: "PLAYER_NOT_FOUND",
            message: "Player not found",
            statusCode: 404,
            fields: {},
            details: {}
        });

        this.fields = params.fields;
    }
}