# SearchToPlay

Landing page cyberpunk do **SearchToPlay**: uma camada de decisão sobre a sua biblioteca de jogos. O produto cruza biblioteca, tempo, humor, hardware e grupo para dizer o que jogar agora.

- Site: <https://fabianoflorentino.github.io/searchtoplay/>
- Plano público: [PLANO.md](PLANO.md) (foco no produto, sem números financeiros)
- Apresentação: [APRESENTACAO.pdf](APRESENTACAO.pdf) (versão pública, focada no produto)

## Estrutura

```
.
├── index.html                 # landing page
├── 404.html                   # página de erro
├── assets/
│   ├── css/style.css          # tema cyberpunk, animações e responsivo
│   ├── js/main.js             # canvas, terminal, contadores, reveal, menu
│   ├── js/config.js           # URL do formulário beta e repositório
│   └── img/                   # favicon, logo, ícones e OG image
├── .github/workflows/pages.yml
├── PLANO.md
└── APRESENTACAO.pdf
```

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Não há build. O site é HTML/CSS/JS estático.

## Configurar o formulário beta

Edite `assets/js/config.js`:

```js
window.STP_CONFIG = {
  betaFormUrl: "https://forms.gle/SEU_FORMULARIO",
  githubRepo: "https://github.com/fabianoflorentino/searchtoplay",
};
```

Enquanto `betaFormUrl` estiver vazio, os botões "Entrar na lista" mostram um aviso e rolam até a seção de validação.

## Deploy

O deploy é feito pelo GitHub Actions em `.github/workflows/pages.yml`:

1. O repositório precisa estar público (ou Pages habilitado no plano adequado).
2. Em **Settings → Pages**, a fonte deve ser **GitHub Actions**.
3. Cada push na `main` publica o site.

## Notas

- Os caminhos são relativos para funcionar em project pages (`/searchtoplay/`).
- O canvas e as animações respeitam `prefers-reduced-motion`.
- O conteúdo é um documento de visão; não é oferta de investimento.
- Licença do core ainda em decisão no plano (AGPLv3 vs. open-core).
