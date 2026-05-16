# Pesca Local — Contexto do Projeto

## O que é
Site guia regional de pesca da Baixada Santista e litoral sul de São Paulo.
URL em produção: https://pesca-local.vercel.app
Domínio oficial futuro: pescalocal.com.br
Monetização via anúncios de parceiros (lojas, guias, marinas, pesqueiros).
O dono do projeto é PO, não é desenvolvedor.
WhatsApp do dono (contato comercial): 5513996243365

## Stack
- Next.js 16 com App Router
- TypeScript
- CSS puro (globals.css) — NÃO usar Tailwind, NÃO usar CSS modules
- Dados estáticos em JSON (sem banco de dados por enquanto)
- Deploy via Vercel (GitHub: acjr10/pesca-local)

## Estrutura de pastas
app/
  layout.tsx              ← header e footer globais
  page.tsx                ← home (use client)
  globals.css             ← todo o CSS do site
  cidades/page.tsx        ← listagem de cidades
  cidades/[slug]/page.tsx ← página individual de cidade
  especies/page.tsx       ← listagem de espécies
  especies/[slug]/page.tsx← página individual de espécie (30+ campos)
  pesqueiros/page.tsx     ← listagem com filtro (use client)
  pesqueiros/[slug]/page.tsx
  parceiros/page.tsx      ← listagem com filtro (use client)
  parceiros/[slug]/page.tsx
  previsao/page.tsx       ← Open-Meteo em tempo real (use client)
  anuncie/page.tsx        ← formulário → WhatsApp
  components/
    ConditionsWidget.tsx
    MobileNav.tsx
lib/config.ts             ← SITE_URL e SITE_NAME
src/data/
  cidades.json            ← 6 cidades enriquecidas
  especies.json           ← 10 espécies com 30 campos cada
  parceiros.json          ← 12 parceiros reais
  pesqueiros.json         ← 6 pesqueiros reais
  pontos-de-pesca.json    ← 46 pontos com Google Maps e tipo de fundo
public/
  hero-bg.png
  especies/{id}.png       ← fotos reais dos peixes
  images/og/pesca-local-og.jpg

## Alias
@/data/... → src/data/
@/lib/...  → lib/

## Identidade visual
- Cor principal: #031526
- Destaque: #14c8c2 (turquesa)
- Ação: #0e96c5
- WhatsApp: #22c55e
- Fundo: #f8fafc
- Cards: branco, border #dbe6ee, border-radius 14-18px
- Fonte: Inter
- max-width: 1280px, margin: 0 auto
- TODO o CSS em globals.css

## Classes de cidade
.city-praia-grande → #0e6898 → #0fbfa3
.city-sao-vicente  → #107880 → #0d9ea0
.city-santos       → #124e8a → #1070a8
.city-mongagua     → #106844 → #1aac7a
.city-itanhaem     → #0e7860 → #0fa898
.city-peruibe      → #0a5478 → #0e9b70

## Slugs
Cidades: praia-grande, sao-vicente, santos, mongagua, itanhaem, peruibe
Espécies: robalo, pescada, corvina, bagre, espada, parati, tainha, carapicu, betara, linguado

## formatCityName (usar sempre ao exibir slug de cidade)
const formatCityName = (slug: string): string => ({'praia-grande':'Praia Grande','sao-vicente':'São Vicente','santos':'Santos','mongagua':'Mongaguá','itanhaem':'Itanhaém','peruibe':'Peruíbe'}[slug] || slug)

## Campos dos JSONs

cidades.json: id, nome, estado, regiao, descricao, tiposPesca, tiposPescaFortes,
especies, pontos, melhorEpoca, melhorHorario, iscasRecomendadas, materiaisRecomendados,
observacoes, resumoPesca, pontosPrioritarios, roteirosPorPerfil, cuidadosLocais,
quandoEvitar, observacaoLocal, imagem

especies.json (30 campos): id, nome, nomeCientifico, descricao, ambiente, melhorEpoca,
melhorHorario, mareFavoravel, iscasNaturais, iscasArtificiais, materialRecomendado,
nivelDificuldade, dicas, cidades, imagem, ondeEncontrar, comoPescar, dicaMestre,
iscasPorSituacao, equipamentoBasico, equipamentoIdeal, setupPorMare, impactoVento,
tamanhoComumRegiao, errosComuns, nivelDificuldadeMotivo, cidadesContexto, dicasRapidas,
defeso, tamanhoMinimo, parceirosRelacionados

pontos-de-pesca.json (46 pontos): id, nome, cidade, tipo, descricao, especies,
melhorEpoca, melhorHorario, mareFavoravel, iscasRecomendadas, materialRecomendado,
acesso, googleMapsUrl, estacionamento, estrutura, dificuldadeAcesso, tipoFundo,
riscoEnrosco, segurancaECuidados, indicadoPara, quandoEvitar

parceiros.json: id, nome, categoria, cidade, descricao, whatsapp, instagram, site,
endereco, plano (gratuito|destaque), ativo, estrelas, avaliacoes

pesqueiros.json: id, nome, cidade, descricao, peixes, estrutura, tiposPesca,
iscasRecomendadas, materialRecomendado, pescaNoturna, whatsapp, instagram, endereco, site

## Padrões de código
- params: sempre async { params: Promise<{ slug: string }> }, fazer await params
- Busca JSON: (data as any[]).find(...) ou .filter(...)
- Nunca duplicar header/footer
- Páginas internas: começar com <> (fragment)
- use client: apenas em páginas com filtros, busca ou APIs
- Optional chaining em campos novos: especie?.ondeEncontrar?.map(...)
- Imagens: /especies/{id}.png
- WhatsApp: href="https://wa.me/{numero}" target="_blank"

## Modelo comercial
- Gratuito: presença básica, SEM WhatsApp/Instagram/site público
- Destaque: R$49/mês lançamento, COM contato + prioridade + destaque visual
- Formulário /anuncie → WhatsApp 5513996243365
- Destaque: partner-card featured (borda turquesa)

## APIs
- Open-Meteo Forecast + Marine (sem API key)
- Coords base: lat -23.98, lng -46.26 (Praia Grande)
- Lua calculada em JS puro

## Páginas — todas completas
Home, /cidades, /cidades/[slug], /especies, /especies/[slug],
/pesqueiros, /pesqueiros/[slug], /parceiros, /parceiros/[slug],
/previsao, /anuncie

## CSS reutilizável
.city-card, .city-thumb, .city-{slug}, .city-card-body, .city-chip
.partner-card, .partner-card.featured, .whatsapp-btn
.tipo-tag, .cidade-section, .section-title
.pontos-grid, .ponto-card, .cidade-info-grid, .info-card
Filtros: select padding 10px 14px, border 1px solid #dbe6ee, border-radius 10px
