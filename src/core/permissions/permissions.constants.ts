// Profile Permissions
export const PROFILE_READ = 1n << 0n;
export const PROFILE_UPDATE = 1n << 1n;
export const PROFILE_DELETE = 1n << 2n;

// Message Permissions
export const MESSAGE_CREATE = 1n << 3n;
export const MESSAGE_READ = 1n << 4n;
export const MESSAGE_UPDATE = 1n << 5n;
export const MESSAGE_DELETE = 1n << 6n;

// Conversation Permissions
export const CONVERSATION_CREATE = 1n << 7n;
export const CONVERSATION_READ = 1n << 8n;
export const CONVERSATION_UPDATE = 1n << 9n;
export const CONVERSATION_DELETE = 1n << 10n;

// Resource Permissions
export const RESOURCE_CREATE = 1n << 11n;
export const RESOURCE_READ = 1n << 12n;
export const RESOURCE_UPDATE = 1n << 13n;
export const RESOURCE_DELETE = 1n << 14n;

// Admin Permissions (System level)
export const SYSTEM_MANAGE = 1n << 60n; // High bit for admin stuff
