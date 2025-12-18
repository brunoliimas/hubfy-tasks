import jwt from 'jsonwebtoken';
import bycript from 'bcryptjs';
import { UserPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(password: string): Promise<string> {
    return bycript.hash(password, 10);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bycript.compare(password, hashedPassword);
}

export function generateToken(user: UserPayload): string {
    return jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
}

export function verifyToken(token: string): UserPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch {
        return null;
    }
}