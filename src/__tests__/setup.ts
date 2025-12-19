import dotenv from 'dotenv'

dotenv.config()

// Testes de API precisam do servidor rodando
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

export { BASE_URL }