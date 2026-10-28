# Prompt: configurar o banco da newsletter na Vercel

> Cole o texto abaixo (a partir de "Contexto") numa conversa com o **Claude in Chrome**, já logado na sua conta da Vercel.
> Ele vai pedir sua confirmação antes de aceitar termos ou criar o banco — isso é esperado.
> A variável `NEWSLETTER_ADMIN_TOKEN` é um segredo: **você** cria (passo 4); a extensão não digita senhas/tokens.

---

## Contexto

Tenho um site Next.js chamado **Spoilado** hospedado na Vercel (repositório GitHub `GabrielPongelupe/site-filmes`).
O código da newsletter já está pronto (`app/api/newsletter/route.ts`) e só precisa de um banco **Upstash Redis**
conectado ao projeto. O código lê as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`
(ou `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`) e `NEWSLETTER_ADMIN_TOKEN`.

## O que fazer, no painel da Vercel (vercel.com)

1. Abra o projeto do site (o ligado ao repositório `site-filmes`). Se houver mais de um parecido, **pare e me pergunte** qual é.
2. Vá em **Storage** → **Create Database** → **Upstash** → **Upstash for Redis**.
   - Plano: **Free** (não escolha nenhum plano pago; se só houver opção paga, pare e me avise).
   - Nome do banco: `spoilado-newsletter`.
   - Região: a mais próxima de **São Paulo (gru1)**; se não houver, **Washington (iad1)**.
   - Antes de aceitar os termos do Upstash ou concluir a criação, me mostre o resumo (plano, preço, região) e espere meu "ok".
3. Conecte o banco ao projeto do site, marcando os ambientes **Production**, **Preview** e **Development**.
   Confirme em **Settings → Environment Variables** que apareceram variáveis com nomes como `KV_REST_API_URL` e
   `KV_REST_API_TOKEN` (ou `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`). **Não copie nem me mostre os valores.**
4. Peça para eu criar a variável `NEWSLETTER_ADMIN_TOKEN` (eu mesmo digito o valor) em
   **Settings → Environment Variables**, nos ambientes Production e Preview. Espere eu dizer "feito".
5. Faça um **Redeploy** do último deploy de produção (Deployments → último deploy de Production → ⋯ → Redeploy),
   para o site carregar as variáveis novas. Espere terminar.
6. Teste a inscrição: abra `https://www.spoilado.com/pt-br/newsletter`, inscreva o e-mail
   `teste+spoilado@exemplo.com` e veja se aparece a mensagem de sucesso ("Pronto! Você está inscrito…").
   Só esse e-mail de teste — não use nenhum e-mail meu ou de outra pessoa.

## Não faça

- Não escolha plano pago, não adicione cartão, não altere billing.
- Não apague nem altere bancos, variáveis ou projetos que já existam.
- Não copie, mostre ou cole valores de tokens/senhas em lugar nenhum.
- Não mexa em domínio, Git ou outras configurações do projeto.

## O que me retornar (em lista curta)

1. Nome do projeto da Vercel usado e o domínio de produção.
2. Banco criado: nome, provedor (Upstash), plano e região.
3. Nomes (sem valores) das variáveis de ambiente criadas pela integração e em quais ambientes estão.
4. Se `NEWSLETTER_ADMIN_TOKEN` aparece na lista de variáveis (só sim/não, sem valor).
5. Status do redeploy (ok/erro) e o link do deploy.
6. Resultado do teste do passo 6 (mensagem que apareceu na tela).
7. Qualquer erro, aviso ou passo que você não conseguiu fazer.
