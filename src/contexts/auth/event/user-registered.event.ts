export const AUTH_USER_REGISTER_EVENT = 'user.registered';

export class UserRegisteredEvent {
    static eventName = AUTH_USER_REGISTER_EVENT;

    static create(payload: { email: string; id: string; username: string }) {
        return { eventName: UserRegisteredEvent.eventName, payload };
    }
}
