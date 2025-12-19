import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware";
import { createTaskSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
    const user = getAuthUser(request);

    if (!user) {
        return NextResponse.json(
            { message: "Não Autorizado" },
            { status: 401 }
        );
    }

    try {
        const tasks = await prisma.task.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(
            { tasks },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao listar tarefas:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const user = getAuthUser(request);

    if (!user) {
        return NextResponse.json(
            { message: "Não Autorizado" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();

        // Validação com Zod
        const result = createTaskSchema.safeParse(body);
        if (!result.success) {
            const firstError = result.error.issues[0];
            return NextResponse.json(
                { message: firstError.message },
                { status: 400 }
            );
        }

        const { title, description, status } = result.data;

        const task = await prisma.task.create({
            data: {
                title,
                description: description || null,
                status,
                userId: user.id,
            },
        });

        return NextResponse.json(
            { task },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}