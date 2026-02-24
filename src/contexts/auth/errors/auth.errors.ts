import { DomainError } from "src/core/errors/domain-error";

export class InvalidCredentialsError extends DomainError {
    constructor() {
        super({
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password",
            statusCode: 401,
            fields: {},
            details: {},
        });
    }
}

export class InvalidRefreshTokenError extends DomainError {
    constructor() {
        super({
            code: "INVALID_REFRESH_TOKEN",
            message: "Refresh token is invalid or expired",
            statusCode: 401,
            fields: {},
            details: {},
        });
    }
}

export class UserNotFoundError extends DomainError {
    constructor() {
        super({
            code: "USER_NOT_FOUND",
            message: "User not found",
            statusCode: 404,
            fields: {},
            details: {},
        });
    }
}