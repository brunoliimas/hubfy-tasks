import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validacao ZOD

        const result = loginSchema.safeParse(body);
        if (!result.success) {
            const firstError = result.error.issues[0];
            return NextResponse.json(
                { error: firstError.message },
                { status: 400 }
            );
        }


        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email e senha são obrigatórios." },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Email ou senha inválidos." },
                { status: 401 }
            );
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Email ou senha inválidos." },
                { status: 401 }
            );
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            name: user.name
        });

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Erro no login:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}



