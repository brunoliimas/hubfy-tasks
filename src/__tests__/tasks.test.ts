import { BASE_URL } from './setup'

describe('Tasks API', () => {
    let authToken: string
    let taskId: number
    const timestamp = Date.now()

    const testUser = {
        name: 'Task Tester',
        email: `tasktest${timestamp}@exemplo.com`,
        password: 'senha123456'
    }

    // Cria usuário e obtém token antes dos testes
    beforeAll(async () => {
        await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        })

        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        })

        const data = await loginResponse.json()
        authToken = data.token
    })

    describe('POST /api/tasks', () => {
        it('deve criar nova tarefa', async () => {
            const response = await fetch(`${BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    title: 'Tarefa de teste',
                    description: 'Descrição da tarefa',
                    status: 'pending'
                })
            })

            const data = await response.json()

            expect(response.status).toBe(201)
            expect(data.task).toBeDefined()
            expect(data.task.title).toBe('Tarefa de teste')
            expect(data.task.status).toBe('pending')

            taskId = data.task.id
        })

        it('deve rejeitar sem autenticação', async () => {
            const response = await fetch(`${BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Tarefa sem auth',
                    status: 'pending'
                })
            })

            expect(response.status).toBe(401)
        })

        it('deve rejeitar sem título', async () => {
            const response = await fetch(`${BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    description: 'Sem título',
                    status: 'pending'
                })
            })

            expect(response.status).toBe(400)
        })
    })

    describe('GET /api/tasks', () => {
        it('deve listar tarefas do usuário', async () => {
            const response = await fetch(`${BASE_URL}/api/tasks`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })

            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.tasks).toBeDefined()
            expect(Array.isArray(data.tasks)).toBe(true)
            expect(data.tasks.length).toBeGreaterThan(0)
        })

        it('deve rejeitar sem autenticação', async () => {
            const response = await fetch(`${BASE_URL}/api/tasks`)

            expect(response.status).toBe(401)
        })
    })

    describe('PUT /api/tasks/[id]', () => {
        it('deve atualizar tarefa', async () => {
            const response = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    title: 'Tarefa atualizada',
                    status: 'in_progress'
                })
            })

            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.task.title).toBe('Tarefa atualizada')
            expect(data.task.status).toBe('in_progress')
        })

        it('deve rejeitar sem autenticação', async () => {
            const response = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Sem auth' })
            })

            expect(response.status).toBe(401)
        })

        it('deve rejeitar tarefa inexistente', async () => {
            const response = await fetch(`${BASE_URL}/api/tasks/99999`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ title: 'Não existe' })
            })

            expect(response.status).toBe(404)
        })
    })

    describe('DELETE /api/tasks/[id]', () => {
        it('deve rejeitar sem autenticação', async () => {
            const response = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
                method: 'DELETE'
            })

            expect(response.status).toBe(401)
        })

        it('deve deletar tarefa', async () => {
            const response = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })

            expect(response.status).toBe(200)
        })

        it('deve rejeitar tarefa já deletada', async () => {
            const response = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })

            expect(response.status).toBe(404)
        })
    })
})