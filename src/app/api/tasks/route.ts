import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware";


// GET - Listar tarefas do usuario autenticado
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
            tasks,
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao listar tarefas:", error);
        return NextResponse.json(
            { message: "Erro interno do servdor" },
            { status: 500 }
        );
    }
}


// POST - Criar uma nova tarefa para o usuario autenticado
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
        const { title, description, status } = body;

        if (!title) {
            return NextResponse.json(
                { message: "O título é obrigatório" },
                { status: 400 }
            );
        }

        const validStatus = ["pending", "in-progress", "completed"];
        if (status && !validStatus.includes(status)) {
            return NextResponse.json(
                { message: "Status inválido" },
                { status: 400 }
            );
        }

        const task = await prisma.task.create({
            data: {
                title,
                description: description || null,
                status: status || "pending",
                userId: user.id,
            },
        })
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