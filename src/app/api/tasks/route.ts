import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware";
import { createTaskSchema } from "@/lib/validations";
import { TaskStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
    const user = getAuthUser(request);

    if (!user) {
        return NextResponse.json(
            { message: "Não Autorizado" },
            { status: 401 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '4');
        const status = searchParams.get('status');

        const skip = (page - 1) * limit;

        const validStatuses: TaskStatus[] = ['pending', 'in_progress', 'completed'];
        const statusFilter = status && validStatuses.includes(status as TaskStatus)
            ? (status as TaskStatus)
            : undefined;

        const where = {
            userId: user.id,
            ...(statusFilter && { status: statusFilter })
        };

        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.task.count({ where })
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }, { status: 200 });
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