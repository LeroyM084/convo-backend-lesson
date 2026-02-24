import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { PermissionsUtils } from '../permissions.utils';
import { UserCredentialsEntity } from '../../../contexts/auth/entities/user_credentials.entities';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<bigint>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        // Assuming user corresponds to UserCredentialsEntity or a similar structure with a rights column
        if (!user || user.rights === undefined) {
            throw new ForbiddenException('Insufficient permissions: No user permissions found');
        }
        const userPermissions = typeof user.rights === 'string' ? BigInt(user.rights) : BigInt(user.rights);

        if (!PermissionsUtils.hasAll(userPermissions, requiredPermissions)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}
