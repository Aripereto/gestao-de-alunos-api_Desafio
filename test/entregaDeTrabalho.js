import { api } from './helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin, comTokenDeUsuario } from './helpers/auth.js';
import testesDeTrabalho from './fixtures/trabalho.json' with { type: 'json' };

describe('Entrega de Trabalho', () => {
    testesDeTrabalho.forEach((testeDeTrabalho) => {

        it.only(testeDeTrabalho.testTitle, async () => {
            expect(testeDeTrabalho.dadosAluno).to.exist;
            const dadosAluno = {
                ...testeDeTrabalho.dadosAluno,
                email: `${Date.now()}.${testeDeTrabalho.dadosAluno.email}`,
                matricula: `${testeDeTrabalho.dadosAluno.matricula}-${Date.now()}`,
            };

            const cadastroAlunoResposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                //.set('Authorization', await comTokenDeUsuario())
                .send(dadosAluno);

            expect(cadastroAlunoResposta.status).to.equal(201);
            const alunoId = cadastroAlunoResposta.body.id;

            if (testeDeTrabalho.cenario === 'cadastro') {
                return;
            }

            const matriculaResposta = await api()
                .post(`/api/admin/disciplinas/${testeDeTrabalho.dadosTrabalho.disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send({ alunoId });

            expect(matriculaResposta.status).to.equal(201);

            const tokenDeAluno = await comTokenDeUsuario(
                dadosAluno.email,
                dadosAluno.senha
            );
            const entregaTrabalhoResposta = await api()
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenDeAluno)
                .send(testeDeTrabalho.dadosTrabalho);

            expect(entregaTrabalhoResposta.status).to.equal(testeDeTrabalho.statusCodeEsperado);
            expect(entregaTrabalhoResposta.body.alunoId).to.equal(alunoId);
            expect(entregaTrabalhoResposta.body.titulo).to.equal(testeDeTrabalho.dadosTrabalho.titulo);
        });
    });
});