import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import {getAuthUser} from "@/lib/middleware";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const user = getAuthUser(request);

    if (!user) {
        return NextResponse.json(
            { message: "Não Autorizado" },
            { status: 401 }
        );
    }

    try {
        const { id } = await params;
        const taskId = parseInt(id, 10);
        if (isNaN(taskId)) {
            return NextResponse.json(
                { message: "ID de tarefa inválido" },
                { status: 400 }
            );
        }

        const existingTask = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!existingTask){ 
            return NextResponse.json(
                { message: "Tarefa não encontrada" },
                { status: 404 }
            );
        }   

        if (existingTask.userId !== user.id) {
            return NextResponse.json(
                { message: "Não autorizado a atualizar esta tarefa" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, description, status } = body;

        const validStatus = ["pending", "in_progress", "completed"];
        if (status && !validStatus.includes(status)) {
            return NextResponse.json(
                { message: "Status inválido" },
                { status: 400 }
            );
        }

        const task = await prisma.task.update({
            where: { id: taskId },
            data: {
                ...(title && { title }),
                ... (description !== undefined && { description }),
                ... (status && { status }),
            },
        });
        return NextResponse.json({task}, { status: 200 });
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        return NextResponse.json(
            { message: "Erro interno do servdor" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const user = getAuthUser(request);

    if (!user) {
        return NextResponse.json(
            { message: "Não Autorizado" },
            { status: 401 }
        );
    }

    try {
        const { id } = await params;
        const taskId = parseInt(id, 10);
        if (isNaN(taskId)) {
            return NextResponse.json(
                { message: "ID de tarefa inválido" },
                { status: 400 }
            );
        }   
        const existingTask = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!existingTask){ 
            return NextResponse.json(
                { message: "Tarefa não encontrada" },
                { status: 404 }
            );
        }   

        if (existingTask.userId !== user.id) {
            return NextResponse.json(
                { message: "Não autorizado a deletar esta tarefa" },
                { status: 403 }
            );
        }

        await prisma.task.delete({
            where: { id: taskId },
        });

        return NextResponse.json(
            { message: "Tarefa deletada com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        return NextResponse.json(
            { message: "Erro interno do servdor" },
            { status: 500 }
        );
    }
}