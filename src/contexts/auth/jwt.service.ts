import { Injectable } from "@nestjs/common";
import { JWTServiceInterface } from "./interface/jwt.interface";
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JWTService implements JWTServiceInterface{
    async generateToken(payload: object, expiresIn?: string | number): Promise<string> {
        return jwt.sign(payload, 'your-secret-key', { expiresIn: expiresIn || '1h' });
    }

    async verifyToken(token: string): Promise<object | null> {
        return jwt.verify(token, 'your-secret-key') as object;
    }
}