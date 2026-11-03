# SearchToPlay — Plano do Projeto

> Documento público focado no problema e no valor entregue. Sem números financeiros. Última atualização: 2026-11-02.

## 1. Visão

Um **search to play**: dado o contexto do jogador (tempo disponível, humor, com quem vai jogar, plataforma, hardware) e a biblioteca real dele, dizer **o que jogar agora** — com justificativa e link para abrir/instalar.

Não é loja, não é comparador de preços e não é launcher. É uma camada de decisão em cima do que a pessoa já tem.

## 2. Problema

- Bibliotecas grandes (200–1.000+ jogos) acumuladas por anos e pouco tempo para decidir.
- A recomendação da Steam é um funil de venda, não uma ajuda para decidir o que jogar.
- A busca da Steam exige que você já saiba o nome do jogo ou cace tags.
- O "Play Next" é raso e só enxerga a Steam.
- Assistentes genéricos (IA de conversa) até pesquisam fatos públicos, mas não acessam biblioteca, playtime, hardware, tempo ou grupo do usuário — e não executam ações.
- Ninguém ocupa a interseção: **intenção + biblioteca real + tempo/humor + cross-platform + explicação**.

## 3. Proposta de valor

- Decisão em ~10 segundos, não uma lista infinita.
- Recomendação **explicável** ("6h, coop, parece com o que você terminou, roda no seu hardware").
- Foco no que a pessoa **já possui**; comprar é secundário.
- Biblioteca cross-platform (Steam primeiro; Epic/GOG/PSN/Xbox depois).
- Privacidade: dados locais, self-hosted opcional, sem telemetria.
- Sem viés comercial: o produto pode dizer "não compre, jogue o que você tem".
- Sem anúncios, sem venda de dados e sem lock-in.

## 4. Público

| Segmento | Perfil | Papel |
|---|---|---|
| **ICP** | Adulto 25–45, PC/Steam, 10+ anos de conta, 100+ jogos, pouco tempo | Foco principal |
| Catálogo modesto | 5–30 jogos, começando ou casual | Descoberta por gosto; converte com o tempo |
| Sem biblioteca | Console/F2P | Fase posterior; descoberta e disponibilidade |
| Criadores de gameplay | 10k–200k, variedade/retro/horror/co-op | Extensão Creator Mode |

O ICP é o foco principal do produto. Os demais são aquisição e não devem ser tratados como cidadãos de segunda classe.

## 5. Produto (MVP)

1. **Busca por intenção**: "coop curto pra jogar com alguém em 40 min", "algo leve pra notebook", "parecido com X mas mais curto".
2. **Backlog / "o que jogar agora"**: ranqueia a biblioteca por contexto e histórico.
3. **Import da biblioteca Steam** via perfil público (SteamID64/vanity) + API key do servidor. OAuth opcional para perfis privados.
4. **Recomendação explicável** + botão `steam://` para instalar/abrir.
5. **Coop de grupo** (fase 2): interseção de bibliotecas e hardware.
6. **PWA com push** (fase 3).

### Modelo de gosto

- **Longo prazo:** biblioteca, playtime, jogos abandonados, gêneros que termina vs. larga, preferência solo/coop, dificuldade.
- **Contexto:** tempo disponível, humor/energia, modo de jogo, continuar ou começar algo novo.
- **Restrições:** possui, roda no hardware, está instalado, o grupo todo possui.
- **Score:** `fit(contexto) × afinidade(perfil) × qualidade − fadiga/abandono`.
- **Sempre explicável.** Sem caixa-preta.

### Cold start

- Avaliar 10 jogos que amou/odiou + 3 perguntas.
- Importar biblioteca se existir.
- Funciona com 5 jogos: nesse caso o valor vem de descoberta por gosto, disponibilidade gratuita/assinatura, demos e biblioteca de amigos/família.

## 5.1 Creator Mode (extensão)

Público: criadores de gameplay (variety, retro, horror, co-op) e suas equipes. O job não é "o que jogar", é **"o que gravar que vire série, audiência e não dê dor de cabeça?"**

### O que entrega

1. **Pauta com content-fit** — score de conteúdo, estimativa de episódios, por que agora e riscos.
2. **Planejador de série** — nº de episódios, duração, ritmo e runway de conteúdo.
3. **Matriz de grupo/coop** — interseção de bibliotecas, crossplay, max players e duração de sessão.
4. **Radar de timing** (fase 2) — Twitch/YouTube vs. saturação; janela de first-mover.
5. **Disponibilidade** (fase 2) — Game Pass, PS Plus, demos e playtests para reduzir atrito.
6. **Pesquisa spoiler-safe + checklist de monetização** (fase 2).
7. **Export** para Notion/Google Calendar.

### Perfis de nicho

- Retro/desafio/série longa.
- Horror/reação/co-op.
- Variedade/grupo.
- História/lore.

O perfil do criador ajusta o score — o mesmo jogo não serve para os três.

### Posicionamento

- Extensão para criadores, sem parceria ou afiliado.
- A adoção é orgânica porque a ferramenta resolve a rotina de pauta.
- O foco é a ponte entre criador e audiência.

### Métricas

- Tempo economizado na pauta.
- Séries planejadas e concluídas.
- Retenção de criadores.
- Instalações/cliques vindos de criadores.

### Validação

- 10–20 criadores médios (10k–200k), não os grandes no início.
- Protótipo manual de "pauta + série + grupo"; medir se economiza tempo e se eles usariam de novo.

### Cuidados

- Criador é cético e ocupado; não competir com ferramentas genéricas de YouTube.
- Não começar por thumbnail/título.
- Não exigir OAuth de tudo.
- Exportar para o fluxo existente (Notion/Calendar).

## 6. O que o produto entrega

- **Decisão em ~10 segundos:** 1 a 3 jogos, não uma lista de 300.
- **Motivo claro:** explica por que aquele jogo, agora.
- **Foco no que você já tem:** prioriza a biblioteca; comprar é secundário.
- **Backlog priorizado:** por onde começar e o que deixar para depois.
- **Coop sem fricção:** o que o grupo possui, roda e pode jogar junto.
- **Privacidade por padrão:** dados locais, self-hosted opcional, sem telemetria.
- **Creator Mode:** pauta, série e grupo para quem grava conteúdo.
- **Sem ruído:** sem anúncios, sem venda de dados e sem recomendação patrocinada.

## 7. Arquitetura e infraestrutura

### Papéis

- **Homelab (i5 dual-core, 16 GB):** desenvolvimento, staging, espelho de catálogo e instância pessoal. **Nunca** produção.
- **Produção:** VPS pequena para sync, catálogo e API.
- **Self-hosted:** imagem Docker para quem quer privacidade e controle.

### Desenho de referência

```
VPS
├── Caddy (TLS, rate limit, estático)
├── api (Go, binário único, multi-tenant por tenant_id)
├── worker (sync IGDB/Steam + embeddings + jobs)
├── Postgres 16 + pgvector (catálogo único + dados por usuário)
└── backup noturno → storage de objetos
```

Catálogo e embeddings são **compartilhados** entre todos os usuários. Dados pessoais ficam por tenant. Isso mantém a operação leve.

### Stack

- Backend: Go + chi.
- Frontend: SvelteKit (SSR leve) ou Go + templ/HTMX.
- Banco: PostgreSQL 16 + pgvector + FTS nativo.
- Deploy: Docker Compose + GitHub Actions (build → SSH pull).
- Filas: cron + tabela de jobs (sem Redis no início).
- E-mail: Resend ou SES.
- Observabilidade: Uptime Kuma + logs em journald + alerta no Telegram.

### Fontes de dados

- IGDB (metadados; exige atribuição).
- Steam Web API (detalhes, requisitos, reviews, owned games).
- Import por perfil público Steam (SteamID64) para evitar a exigência de URL pública de OAuth.
- Revisar os ToS de IGDB e Steam antes do uso comercial. A Steam proíbe revenda de dados.

## 8. Operação solo

- Deploy automatizado e migrações versionadas.
- Backup noturno com teste de restore mensal.
- TLS automático, UFW, fail2ban, SSH por chave, segredos fora do repositório.
- Rate limit no Caddy e cotas por tenant.
- Tokens e dados sensíveis criptografados.
- LGPD: política de privacidade, exclusão de dados, base legal, minimização.
- Suporte: documentação, FAQ, Discord/Telegram, respostas prontas. Meta < 1% de tickets.

## 9. Métricas de produto

- **Ativação:** % que importa a biblioteca e recebe uma recomendação aceita na primeira sessão.
- **Tempo até a primeira decisão.**
- **Retenção semanal.**
- **Aceitação da recomendação** (proxy de valor real).
- **Utilidade percebida** (survey in-app e entrevistas).
- **Tickets por 100 usuários** (meta < 1).
- **Cobertura de catálogo e correspondência de importação.**

## 10. Validação de alcance (formulário público)

Objetivo: medir dor, tamanho de biblioteca, utilidade e disposição a testar **antes** de construir.

### Perguntas sugeridas

1. Quantos jogos você tem na Steam (aproximado)?
2. Há quantos anos você usa Steam/PC?
3. Quais plataformas você usa? (Steam, Epic, GOG, Xbox, PlayStation, Switch, nenhuma)
4. Quanto tempo por semana você joga?
5. Como você decide o que jogar hoje? (Steam, YouTube, amigos, redes, aleatório)
6. Com que frequência você abre a biblioteca e não sabe o que jogar?
7. O que mais te frustra nessa decisão?
8. Você já usou SteamDB, Backloggd, HowLongToBeat ou similares? O que faltou?
9. Você jogaria algo que já tem se alguém te dissesse "jogue isto agora, por este motivo"?
10. Você importaria sua biblioteca Steam num site para receber recomendações? (sim/não/talvez)
11. O que te faria usar isso toda semana?
12. O que te faria parar de usar?
13. Você topa testar uma versão beta? (e-mail opcional)
14. Como você prefere ser avisado? (Telegram, e-mail, WhatsApp, Discord)

### Critérios de sucesso sugeridos

- ≥ 200 respostas.
- ≥ 30% com 100+ jogos.
- ≥ 20% dispostos a testar o beta.
- ≥ 10% usariam toda semana.
- 10–15 entrevistas qualitativas com o ICP.

### Perguntas para criadores

1. Como você decide o próximo jogo a gravar?
2. Quanto tempo gasta pesquisando duração, coop e potencial de série?
3. Já comprou jogo que não rendeu conteúdo? O que faltou saber?
4. Você usa planilha/Notion para planejar séries?
5. O que te faria usar uma ferramenta de pauta toda semana?
6. Você testaria? O que te faria continuar usando?

Critérios extras: 10–20 entrevistas com criadores médios e ≥ 30% dispostos a usar semanalmente.

Se os critérios não forem atingidos, revisar ICP ou proposta antes de codar.

## 11. Roadmap

1. **Validação:** formulário público + entrevistas.
2. **MVP local:** catálogo (subconjunto de 10–20k jogos), import Steam por perfil público, busca por intenção, backlog, score explicável.
3. **Beta fechado:** 20–100 usuários, métricas de ativação e aceitação.
4. **Nuvem/sync:** auth, sincronização, beta aberto.
5. **Coop de grupo** e mobile push.
6. **Creator Mode:** pauta, planejador de série e matriz de grupo.
7. **Expansão de catálogo e plataformas.**

## 12. Não objetivos (por enquanto)

- Comparador de preços entre lojas.
- Loja ou launcher.
- Rede social de jogos.
- App mobile nativo.
- Modelo de ML próprio.
- SLA agressivo ou suporte 24/7.

## 13. Decisões em aberto

- OAuth Steam vs. apenas perfil público no início.
- Momento de entrada do coop de grupo.
- Licença definitiva (AGPL vs. open-core).
- Limite exato de buscas em linguagem natural por dia.
- Escopo inicial do catálogo.
- Plataformas de importação além da Steam.
- Como medir utilidade sem métricas de vaidade.
- Como manter o self-hosted simples.
