import { z } from 'zod'

export const registerSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Nome é obrigatório' })
        .max(255, { message: 'Nome muito longo' }),
    email: z
        .email({ message: 'Email inválido' }),
    password: z
        .string()
        .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
        .max(100, { message: 'Senha muito longa' })
})

export const loginSchema = z.object({
    email: z
        .email({ message: 'Email inválido' }),
    password: z
        .string()
        .min(1, { message: 'Senha é obrigatória' })
})

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, { message: 'Título é obrigatório' })
        .max(255, { message: 'Título muito longo' }),
    description: z
        .string()
        .max(1000, { message: 'Descrição muito longa' })
        .optional(),
    status: z
        .enum(['pending', 'in_progress', 'completed'])
        .default('pending')
})

export const updateTaskSchema = z.object({
    title: z
        .string()
        .min(1, { message: 'Título é obrigatório' })
        .max(255, { message: 'Título muito longo' })
        .optional(),
    description: z
        .string()
        .max(1000, { message: 'Descrição muito longa' })
        .optional(),
    status: z
        .enum(['pending', 'in_progress', 'completed'])
        .optional()
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>