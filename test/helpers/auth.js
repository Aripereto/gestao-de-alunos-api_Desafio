import { api } from './api.js';
import 'dotenv/config';

let tokenAdminEmCache = null;
const tokensDeUsuarioEmCache = new Map();

async function fazerLogin(email, senha) {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email, senha });

    return loginResposta.body.token;
}

export async function comTokenDeAdmin() {
    if (!tokenAdminEmCache) {
        tokenAdminEmCache = await fazerLogin(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_SENHA
        );
    }

    return `Bearer ${tokenAdminEmCache}`;
}

export async function comTokenDeUsuario(
    email = process.env.ALUNO_EMAIL || 'ariane.pereto@example.com',
    senha = process.env.ALUNO_SENHA || '123456'
) {
    const chave = `${email}:${senha}`;
    if (!tokensDeUsuarioEmCache.has(chave)) {
        tokensDeUsuarioEmCache.set(chave, await fazerLogin(email, senha));
    }

    return `Bearer ${tokensDeUsuarioEmCache.get(chave)}`;
}

export async function getToken(emailUser, passUser) {
    return fazerLogin(emailUser, passUser);
}