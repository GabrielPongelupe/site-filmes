# Prompt: validar o deploy e a newsletter do Spoilado na Vercel

> **Antes de colar:** o código da newsletter (`app/api/newsletter/`, `lib/newsletter.ts`, `components/NewsletterForm.tsx`,
> `app/[locale]/newsletter/`, `proxy.ts`) precisa estar **commitado e enviado (push) para o GitHub** na branch `main`.
> Se ainda não estiver, o deploy da Vercel não terá a rota e tudo abaixo vai falhar com 404.
>
> Cole o texto a partir de "Contexto" numa conversa com o **Claude in Chrome**, logado na Vercel (e, se possível, no Upstash).
> A extensão não digita senhas/tokens: onde isso for preciso, ela vai te instruir.

---

## Contexto

Site Next.js chamado **Spoilado**, hospedado na Vercel, repositório GitHub `GabrielPongelupe/site-filmes` (branch `main`).
A newsletter funciona assim:

- Formulário em `/<idioma>/newsletter` (ex.: `/pt-br/newsletter`) faz `POST /api/newsletter` com `{ email, locale }`.
- A rota grava o e-mail num hash `newsletter:inscritos` do **Upstash Redis**, via API REST.
- Variáveis lidas pelo código: `KV_REST_API_URL` + `KV_REST_API_TOKEN` (ou `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`)
  e `NEWSLETTER_ADMIN_TOKEN` (senha do `GET /api/newsletter`, que lista os inscritos).
- Respostas esperadas do `POST`: `201` novo inscrito · `200` já inscrito · `400` e-mail inválido · `503` banco não configurado · `502` erro no banco.
- `GET /api/newsletter` sem token deve dar `401`; com `Authorization: Bearer <NEWSLETTER_ADMIN_TOKEN>` lista os inscritos
  (`?formato=csv` devolve CSV).

Eu já criei a variável `NEWSLETTER_ADMIN_TOKEN` na Vercel. **Não sei se o banco Upstash já está conectado nem se o último deploy tem o código da newsletter.**

## Tarefa

Valide tudo, **corrija o que puder** e, para o que você não puder fazer, **me dê instruções passo a passo**. Siga esta ordem e pare em cada falha para resolver antes de seguir.

### 1. Projeto e deploy
1. Na Vercel, abra o projeto ligado ao repositório `site-filmes`. Se houver mais de um parecido, **pare e me pergunte**.
2. Em **Deployments**, veja o último deploy de **Production**: status (Ready/Error), commit e data.
   - Se estiver em **Error**: leia o *Build Logs*, me diga a causa e como corrigir.
   - Se o commit **não for o mais recente** do GitHub, ou o commit não contiver a pasta `app/api/newsletter`, me avise: provavelmente falta eu fazer `git push`.
3. Anote o domínio de produção.

### 2. Variáveis de ambiente (Settings → Environment Variables)
Confirme **só os nomes e os ambientes, nunca os valores**:
- `NEWSLETTER_ADMIN_TOKEN` existe em **Production** (e Preview, se possível)?
- Existe `KV_REST_API_URL` e `KV_REST_API_TOKEN` (ou as `UPSTASH_REDIS_REST_*`) em **Production**?
  - Se faltarem, o banco não está conectado: vá ao passo 3.

### 3. Banco Upstash Redis (se não estiver conectado)
1. Em **Storage**, veja se já existe um banco Upstash Redis ligado a este projeto.
2. Se não existir: **Create Database → Upstash → Upstash for Redis**, plano **Free** (se só houver pago, pare e me avise),
   nome `spoilado-newsletter`, região mais próxima de São Paulo (`gru1`) ou, se não houver, `iad1`.
   **Antes de aceitar termos ou concluir, mostre o resumo (plano, preço, região) e espere meu "ok".**
3. Conecte ao projeto marcando **Production**, **Preview** e **Development**, e confirme que as variáveis do passo 2 apareceram.

### 4. Redeploy
Variáveis novas só valem em deploys feitos depois delas. Se você criou/alterou variáveis ou conectou o banco agora,
faça **Redeploy** do último deploy de Production (Deployments → ⋯ → Redeploy) e espere ficar **Ready**.

### 5. Testes no site em produção
Use o domínio de produção. **Use apenas o e-mail de teste `teste+spoilado@exemplo.com`.**
1. Abra `/pt-br/newsletter`, inscreva o e-mail de teste. Esperado: mensagem de sucesso ("Pronto! Você está inscrito…").
2. Inscreva o **mesmo** e-mail de novo. Esperado: mensagem de "já inscrito" (resposta 200, `alreadySubscribed: true`).
3. Tente um e-mail inválido (`abc`). Esperado: mensagem de e-mail inválido.
4. Abra o DevTools (Network) e confirme o status de cada `POST /api/newsletter` (201, 200, 400).
5. Abra `https://<domínio>/api/newsletter` no navegador (GET sem token). Esperado: `401 unauthorized`. Se vier `404`, a rota não está no deploy.
6. Se qualquer `POST` der `503`: variáveis do Redis ausentes no ambiente/deploy. Se der `502`: veja **Logs** do deploy (Observability → Logs, filtre por `/api/newsletter`) e me diga o erro.

### 6. Validar a listagem (parte minha)
Você não deve digitar nem ver o `NEWSLETTER_ADMIN_TOKEN`. **Me instrua** a rodar no meu terminal, substituindo `SEU-SITE` e `SEU_TOKEN`:

```bash
curl https://SEU-SITE/api/newsletter -H "Authorization: Bearer SEU_TOKEN"
```

Esperado: JSON com `ok: true`, `total` e o e-mail de teste na lista. Se vier `401`, o token digitado difere do da Vercel
(me oriente a conferir espaços/quebra de linha no valor da variável e a refazer o redeploy).

### 7. Limpeza do teste
Me diga como remover o e-mail de teste do banco (Upstash → **Data Browser** → chave `newsletter:inscritos` → campo `teste+spoilado@exemplo.com` → deletar).
**Não apague nada você mesmo** sem eu confirmar.

## Não faça

- Não escolha plano pago, não adicione cartão, não mexa em billing.
- Não apague nem altere bancos, variáveis ou projetos já existentes (só adicione o que faltar, com meu ok).
- Não copie, mostre ou cole valores de tokens/senhas em lugar nenhum, nem leia o valor de `NEWSLETTER_ADMIN_TOKEN`.
- Não use e-mails reais (meus ou de outras pessoas) nos testes.
- Não mexa em domínio, Git ou outras configurações do projeto.

## O que me retornar

Uma tabela curta com **OK / FALHOU / PENDENTE (comigo)** para cada item:

1. Projeto da Vercel, domínio de produção, status e commit do último deploy.
2. O deploy contém a rota `/api/newsletter`? (sim/não)
3. Variáveis presentes (só nomes e ambientes).
4. Banco Upstash: existe/criado, plano, região.
5. Redeploy feito? Status.
6. Resultado de cada teste do passo 5 (status HTTP e mensagem na tela).
7. **Lista do que eu preciso fazer** (ex.: `git push`, testar o `curl` do passo 6, apagar o e-mail de teste), com os comandos prontos.
8. Qualquer erro ou aviso encontrado, com a causa provável.
