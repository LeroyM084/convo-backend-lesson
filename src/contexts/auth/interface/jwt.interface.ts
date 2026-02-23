export const JWT_SERVICE = Symbol('JWT_SERVICE');

export interface JWTServiceInterface {
    generateToken(payload: object, expiresIn?: string | number): Promise<string>;
    verifyToken(token: string): Promise<object | null>;
}