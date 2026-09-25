# Rústico Burguer VR · Landing page

Site estático (HTML, CSS e JS puros, sem build) da Rústico Burguer, hamburgueria artesanal no Voldac, Volta Redonda – RJ.
Os pedidos são finalizados no cardápio online do Anota AI.

## Estrutura

```
site/
├── index.html      seções da página
├── css/style.css   visual, animações e responsivo
├── js/data.js      cardápio, preços, horários e links  ← edite aqui
├── js/main.js      interações e efeitos
└── img/            logo, fotos e imagem de compartilhamento
```

## Atualizar preços, horários ou links

Tudo fica em `site/js/data.js`:

- `orderUrl`: link do cardápio online (Anota AI)
- `hours`: horário de cada dia (0 = domingo … 6 = sábado; `null` = fechado). O selo "Aberto agora / Fechado" e a contagem regressiva usam esses horários, no fuso de Brasília.
- `menu`: nome, descrição, preço, etiqueta e foto de cada item
- `offers`, `combos` e `hunger`: o que aparece nos destaques, nos combos e no Fomômetro

Os preços dos cards "Brabo's Cheddar" da seção amarela estão escritos direto no `index.html` (procure por `R$ 26,90` e `R$ 29,90`).

## Testar no computador

Na pasta `site`, rode um servidor estático, por exemplo:

```
npx serve site
```

## Publicar no Render

Static Site com **Publish directory** = `site` e build command vazio (ou use o `render.yaml` como Blueprint).
Depois de publicar, troque o `og:image` do `index.html` pela URL completa da imagem (ex.: `https://seu-site.onrender.com/img/og-image.jpg`) para a prévia aparecer no WhatsApp.
