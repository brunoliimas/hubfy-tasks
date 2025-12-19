import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validacao ZOD
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            const firstError = result.error.issues[0];
            return NextResponse.json(
                { error: firstError.message },
                { status: 400 }
            );
        }

        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Nome, email e senha são obrigatórios." },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "A senha deve ter pelo menos 8 caracteres." },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Endereço de email inválido." },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email já está em uso." },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        return NextResponse.json(
            {
                message: "Usuário registrado com sucesso.",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}  