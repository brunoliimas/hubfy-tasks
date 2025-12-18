import { error } from './../../node_modules/effect/src/Brand';
export interface UserPayload {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: UserPayload;
}

export interface ApiError {
    error: string;
}
