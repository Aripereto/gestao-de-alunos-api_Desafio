import { api } from './api.js';
import 'dotenv/config';

let tokenAdminEmCache = null;
let tokenUsuarioEmCache = null;

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
    if (!tokenUsuarioEmCache) {
        tokenUsuarioEmCache = await fazerLogin(email, senha);
    }

    return `Bearer ${tokenUsuarioEmCache}`;
}

export async function getToken(emailUser, passUser) {
    return fazerLogin(emailUser, passUser);
}