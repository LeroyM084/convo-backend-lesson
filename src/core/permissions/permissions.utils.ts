export const PermissionsUtils = {
    add: (mask: bigint, perm: bigint): bigint => mask | perm,
    remove: (mask: bigint, perm: bigint): bigint => mask & ~perm,
    has: (mask: bigint, perm: bigint): boolean => (mask & perm) !== 0n,
    hasAll: (mask: bigint, perm: bigint): boolean => (mask & perm) === perm,
};

