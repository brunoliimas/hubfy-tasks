import { hashPassword, comparePassword, generateToken, verifyToken } from '@/lib/auth'
import { BASE_URL } from './setup'

describe('Auth Utils', () => {
    describe('Password Hashing', () => {
        it('deve gerar hash diferente da senha original', async () => {
            const password = 'senha123456'
            const hash = await hashPassword(password)

            expect(hash).not.toBe(password)
            expect(hash.length).toBeGreaterThan(0)
        })

        it('deve validar senha correta', async () => {
            const password = 'senha123456'
            const hash = await hashPassword(password)

            const isValid = await comparePassword(password, hash)
            expect(isValid).toBe(true)
        })

        it('deve rejeitar senha incorreta', async () => {
            const password = 'senha123456'
            const hash = await hashPassword(password)

            const isValid = await comparePassword('senhaErrada', hash)
            expect(isValid).toBe(false)
        })
    })

    describe('JWT Token', () => {
        const mockUser = { id: 1, email: 'test@test.com', name: 'Test User' }

        it('deve gerar token válido', () => {
            const token = generateToken(mockUser)

            expect(token).toBeDefined()
            expect(typeof token).toBe('string')
            expect(token.split('.')).toHaveLength(3)
        })

        it('deve verificar token válido', () => {
            const token = generateToken(mockUser)

            const decoded = verifyToken(token)
            expect(decoded).not.toBeNull()
            expect(decoded?.id).toBe(mockUser.id)
            expect(decoded?.email).toBe(mockUser.email)
        })

        it('deve rejeitar token inválido', () => {
            const decoded = verifyToken('token.invalido.aqui')
            expect(decoded).toBeNull()
        })

        it('deve rejeitar token vazio', () => {
            const decoded = verifyToken('')
            expect(decoded).toBeNull()
        })
    })
})

describe('Auth API', () => {
    const timestamp = Date.now()
    const testUser = {
        name: 'Teste User',
        email: `teste${timestamp}@exemplo.com`,
        password: 'senha123456'
    }

    describe('POST /api/auth/register', () => {
        it('deve registrar novo usuário', async () => {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testUser)
            })

            const data = await response.json()

            expect(response.status).toBe(201)
            expect(data.user).toBeDefined()
            expect(data.user.email).toBe(testUser.email)
            expect(data.user.name).toBe(testUser.name)
            expect(data.user.password).toBeUndefined()
        })

        it('deve rejeitar email duplicado', async () => {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testUser)
            })

            expect(response.status).toBe(409)
        })

        it('deve rejeitar email inválido', async () => {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Test',
                    email: 'emailinvalido',
                    password: 'senha123456'
                })
            })

            expect(response.status).toBe(400)
        })

        it('deve rejeitar senha curta', async () => {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Test',
                    email: 'novo@email.com',
                    password: '123'
                })
            })

            expect(response.status).toBe(400)
        })
    })

    describe('POST /api/auth/login', () => {
        it('deve fazer login com credenciais válidas', async () => {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testUser.email,
                    password: testUser.password
                })
            })

            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.token).toBeDefined()
            expect(data.user).toBeDefined()
            expect(data.user.email).toBe(testUser.email)
        })

        it('deve rejeitar senha incorreta', async () => {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testUser.email,
                    password: 'senhaErrada'
                })
            })

            expect(response.status).toBe(401)
        })

        it('deve rejeitar email não cadastrado', async () => {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'naoexiste@email.com',
                    password: 'qualquersenha'
                })
            })

            expect(response.status).toBe(401)
        })
    })
})