/* ==========================================================================
   Rústico Burguer VR — dados da landing page
   Para atualizar preços, horários, links ou destaques, edite só este arquivo.
   ========================================================================== */

window.RUSTICO = {
  orderUrl: 'https://pedido.anota.ai/loja/rstico-burguer-4?f=ms',
  instagramUrl: 'https://www.instagram.com/rusticoburguer.vr/',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Padre+Diogo+Feij%C3%B3%2C+75+-+Voldac%2C+Volta+Redonda+-+RJ%2C+27285-220',
  timezone: 'America/Sao_Paulo',

  // Horário do cardápio online (Anota AI). Índice 0 = domingo … 6 = sábado. null = fechado.
  hours: [
    ['18:45', '23:30'], // domingo
    ['18:45', '23:30'], // segunda
    null, //               terça
    ['18:45', '23:30'], // quarta
    ['18:45', '23:30'], // quinta
    ['18:50', '23:30'], // sexta
    ['18:30', '23:30'], // sábado
  ],

  categories: [
    { id: 'destaques', label: 'Mais vendidos' },
    { id: 'sabores', label: 'Sabores Rústicos' },
    { id: 'preferidos', label: 'Preferidos da galera' },
    { id: 'premium', label: 'Linha Premium' },
    { id: 'combos', label: 'Combos' },
    { id: 'porcoes', label: 'Porções' },
    { id: 'bebidas', label: 'Bebidas' },
  ],

  // img = arquivo em img/menu/<img>.webp
  menu: [
    // ---------- Mais vendidos ----------
    {
      id: 'batata-rustica', cat: 'destaques', img: 'batata-rustica', tag: '10% OFF',
      name: 'Batata Rústica', short: 'Batata Rústica',
      desc: 'A batata da casa pra acompanhar o seu lanche, com 10% OFF no cardápio online.',
      price: 29.9,
    },
    {
      id: 'combo-rustico-refri', cat: 'destaques', img: 'combo-rustico-refri', tag: 'Oferta',
      name: 'Combo Rústico + Refri 500ml', short: 'Combo Rústico',
      desc: '2 Rústicos Tudo, batata frita e refri de 500ml.',
      price: 49.9,
    },
    {
      id: 'rustico-tudo-coca', cat: 'destaques', img: 'rustico-tudo-coca', tag: 'Oferta',
      name: 'Rústico Tudo + Fritas + Coca lata 310ml', short: 'Rústico Tudo + Fritas + Coca',
      desc: 'Rústico Tudo completo, com batata frita crocante e Coca-Cola gelada 310ml. Combo perfeito pra matar a fome de verdade!',
      price: 33.9,
    },
    {
      id: 'promo-burguer-bebida', cat: 'destaques', img: 'promo-burguer-bebida', tag: 'Promo',
      name: 'Rústico Burguer + Bebida', short: 'Rústico Burguer + Bebida',
      desc: 'Pão de gergelim fresquinho, carne à sua escolha, cheddar cremoso ou cream cheese + bebida pra acompanhar.',
      price: 19.9,
    },
    {
      id: 'brabos-duplo-cheddar', cat: 'destaques', img: 'brabos-duplo-cheddar', tag: 'Piscina de cheddar',
      name: "Brabo's Duplo Cheddar + Piscina de Cheddar", short: "Brabo's Duplo Cheddar",
      desc: 'Pão de gergelim, cheddar ou cream cheese em dobro, 2 carnes de 100g e uma piscina de cheddar com bacon pra mergulhar o lanche.',
      price: 29.9,
    },
    {
      id: 'brabos-cheddar', cat: 'destaques', img: 'brabos-cheddar', tag: 'Piscina de cheddar',
      name: "Brabo's Cheddar + Piscina de Cheddar", short: "Brabo's Cheddar",
      desc: 'Pão de gergelim, carne, cheddar ou cream cheese e uma piscina de cheddar com bacon pra mergulhar o lanche.',
      price: 26.9,
    },
    {
      id: 'oferta-burguer-fritas', cat: 'destaques', img: 'oferta-burguer-fritas', tag: 'Bebida grátis',
      name: 'Rústico Burguer + Fritas + Bebida grátis', short: 'Rústico Burguer + Fritas',
      desc: 'Pão de gergelim, carne, cheddar ou cream cheese e batata frita. O Guaraná Mantiqueira 200ml vai de cortesia.',
      price: 23.9,
    },
    {
      id: 'oferta-bacon-fritas', cat: 'destaques', img: 'oferta-bacon-fritas', tag: 'Bebida grátis',
      name: 'Rústico Bacon + Fritas + Bebida grátis', short: 'Rústico Bacon + Fritas',
      desc: 'Pão de gergelim, carne, bacon fatiado, cheddar ou cream cheese e batata frita. A bebida é por nossa conta.',
      price: 25.9,
    },

    // ---------- Sabores Rústicos ----------
    {
      id: 'rustico-tudo', cat: 'sabores', img: 'rustico-tudo',
      name: 'Rústico Tudo Artesanal + Fritas',
      desc: 'Pão de gergelim, hambúrguer artesanal de 100g, cheddar ou cream cheese, ovo frito, bacon crocante, alface e tomate. Acompanha batata frita. Completo e bem servido!',
      price: 26.9,
    },
    {
      id: 'rustico-salada', cat: 'sabores', img: 'rustico-salada',
      name: 'Rústico Salada Artesanal + Fritas',
      desc: 'Pão brioche, hambúrguer artesanal de 100g, cheddar ou cream cheese, alface e tomate. Acompanha batata frita. Sabor e leveza na medida.',
      price: 21.9,
    },
    {
      id: 'rustico-bacon', cat: 'sabores', img: 'rustico-bacon',
      name: 'Rústico Bacon Artesanal + Fritas',
      desc: 'Pão brioche, hambúrguer artesanal de 100g, cheddar ou catupiry e bacon em fatias crocantes. Acompanha batata frita. Um clássico que não tem erro!',
      price: 22.9,
    },
    {
      id: 'promo-artesanal-fritas', cat: 'sabores', img: 'promo-artesanal-fritas', tag: 'Promo',
      name: 'Rústico Burguer Artesanal + Fritas', short: 'Rústico Burguer + Fritas',
      desc: 'Pão de gergelim, carne artesanal de 100g e muito cheddar ou cream cheese derretido. Acompanha batata frita.',
      price: 19.9,
    },
    {
      id: 'salada-bacon', cat: 'sabores', img: 'salada-bacon',
      name: 'Rústico Salada Bacon + Fritas',
      desc: 'Pão brioche, hambúrguer artesanal de 100g, bacon crocante, alface, tomate e cheddar ou cream cheese. Acompanha batata frita.',
      price: 24.9,
    },

    // ---------- Preferidos da galera ----------
    {
      id: 'o-lenhador', cat: 'preferidos', img: 'o-lenhador', tag: 'Novidade',
      name: 'O Lenhador', short: 'O Lenhador',
      desc: 'Pra quem ama queijo: gorgonzola, geleia de bacon caramelizada, carne artesanal de 100g e cebola roxa.',
      price: 35.9,
    },
    {
      id: 'romeu-julieta', cat: 'preferidos', img: 'romeu-julieta',
      name: 'Romeu & Julieta Artesanal',
      desc: 'Pão brioche, carne de 100g, cream cheese com geleia de goiabada e muito bacon.',
      price: 33.9,
    },
    {
      id: 'duplo-cheddar', cat: 'preferidos', img: 'duplo-cheddar', tag: 'Bebida grátis',
      name: 'Duplo Cheddar + Bebida grátis',
      desc: 'Pão de gergelim, 2 carnes e cheddar ou cream cheese em dobro. A bebida vai junto, de graça.',
      price: 24.9,
    },
    {
      id: 'rustico-artesanal', cat: 'preferidos', img: 'rustico-artesanal',
      name: 'Rústico Artesanal',
      desc: 'Pão brioche, carne de 100g, cheddar ou cream cheese, bacon e cebola caramelizada.',
      price: 27.9,
    },

    // ---------- Linha Premium ----------
    {
      id: 'barbecue', cat: 'premium', img: 'barbecue',
      name: 'Barbecue BBQ',
      desc: 'Pão brioche, carne artesanal de 200g, cheddar cremoso ou cream cheese, bacon, cebola roxa e molho barbecue da casa.',
      price: 26.9,
    },
    {
      id: 'campestre', cat: 'premium', img: 'campestre',
      name: 'Campestre',
      desc: 'Pão brioche, carne de 100g, cheddar ou cream cheese, bacon, ovo, alface, tomate, cebola caramelizada e molho barbecue.',
      price: 27.9,
    },
    {
      id: 'prime-double', cat: 'premium', img: 'prime-double', tag: '400g',
      name: 'Prime Double', short: 'Prime Double',
      desc: 'Pão brioche quentinho, 400g de carne artesanal, muito cheddar cremoso, bacon, picles e cebola roxa.',
      price: 39.9,
    },
    {
      id: 'caramel-cream', cat: 'premium', img: 'caramel-cream',
      name: 'Caramel Cream',
      desc: 'Pão brioche, duas carnes de 100g, cream cheese, cebola caramelizada, alface, tomate e muito bacon.',
      price: 33.9,
    },
    {
      id: 'rustico-classico', cat: 'premium', img: 'rustico-classico',
      name: 'Rústico Clássico',
      desc: 'Pão brioche quentinho, carne artesanal de 100g, cheddar cremoso ou cream cheese, alface, tomate e cebola roxa.',
      price: 23.9,
    },
    {
      id: 'bruto-sistematico', cat: 'premium', img: 'bruto-sistematico',
      name: 'Rústico, Bruto & Sistemático',
      desc: 'Pão brioche, 200g de carne artesanal, cheddar ou cream cheese, bacon, alface e tomate.',
      price: 33.9,
    },
    {
      id: 'supremo', cat: 'premium', img: 'supremo',
      name: 'Supremo', short: 'Supremo',
      desc: 'Pão brioche quentinho, 200g de carne artesanal, cheddar cremoso ou cream cheese, bacon, ovo e cebola caramelizada artesanal.',
      price: 35.9,
    },

    // ---------- Combos ----------
    {
      id: 'combo-clt', cat: 'combos', img: 'combo-clt',
      name: 'Combo CLT',
      desc: 'Pra você que trabalha 6x1, chegou em casa e tá fugindo do fogão: 2 Rústicos Tudo artesanais + 2 batatas médias + 2 bebidas à sua escolha.',
      price: 59.9,
    },
    {
      id: 'combo-ex-do-amigo', cat: 'combos', img: 'combo-ex-do-amigo',
      name: 'Combo Ex do Amigo',
      desc: 'É tanta cebola que você vai comer chorando: 2 Onion Bacon lotados de cebola frita, 2 batatas médias crocantes e 2 bebidas à sua escolha.',
      price: 69.9,
    },
    {
      id: 'combo-fome-pedreiro', cat: 'combos', img: 'combo-fome-pedreiro',
      name: 'Combo Fome de Pedreiro',
      desc: 'Supremo recheado com muito cheddar + batata frita grande e refri de 600ml, pra você que passou o dia todo na obra.',
      price: 42.9,
    },

    // ---------- Porções ----------
    {
      id: 'batata-ignorante', cat: 'porcoes', img: 'batata-ignorante', tag: '500g',
      name: 'Batata Ignorante',
      desc: '500g daquela batata ignorantemente recheada com cheddar e bacon.',
      price: 29.52,
    },

    // ---------- Bebidas ----------
    { id: 'coca-zero-350', cat: 'bebidas', name: 'Coca-Cola Zero 350ml', desc: 'A mais pedida da casa', price: 6.8 },
    { id: 'coca-200', cat: 'bebidas', name: 'Coca-Cola Original 200ml', price: 5.2 },
    { id: 'fanta-uva', cat: 'bebidas', name: 'Fanta Uva lata 310ml', price: 6.4 },
    { id: 'fanta-laranja', cat: 'bebidas', name: 'Fanta Laranja lata 310ml', price: 6.4 },
    { id: 'guarana-250', cat: 'bebidas', name: 'Guaraná Mantiqueira 250ml', price: 4.4 },
    { id: 'guarana-500', cat: 'bebidas', name: 'Guaraná Mantiqueira 500ml', price: 5.6 },
    { id: 'mantiqueira-2l', cat: 'bebidas', name: 'Mantiqueira 2L', price: 10.4 },
    { id: 'ativ-290', cat: 'bebidas', name: 'Refresco Guaraná Ativ Plus 290ml', price: 3.6 },
  ],

  // Cards da seção "Os queridinhos de VR" (ids do menu)
  offers: ['promo-artesanal-fritas', 'rustico-tudo-coca', 'brabos-duplo-cheddar', 'oferta-bacon-fritas', 'o-lenhador', 'batata-rustica'],

  // Seção de combos
  combos: [
    {
      id: 'combo-clt',
      sticker: 'Aprovado pelo 6x1',
      pitch: 'Chegou do trampo e tá fugindo do fogão? A janta tá resolvida.',
      serves: 'Serve 2',
      items: ['2 Rústicos Tudo artesanais', '2 batatas médias', '2 bebidas à sua escolha'],
    },
    {
      id: 'combo-ex-do-amigo',
      sticker: 'Vai chorar (de cebola)',
      pitch: 'É tanta cebola que você vai comer chorando.',
      serves: 'Serve 2',
      items: ['2 Onion Bacon lotados de cebola frita', '2 batatas médias crocantes', '2 bebidas à sua escolha'],
    },
    {
      id: 'combo-fome-pedreiro',
      sticker: 'Pra quem ralou o dia todo',
      pitch: 'Passou o dia na obra? Esse aqui levanta até parede.',
      serves: 'Serve 1 (bem faminto)',
      items: ['Supremo recheado com muito cheddar', 'Batata frita grande', 'Refri 600ml'],
    },
  ],

  // Fomômetro: do nível 1 (fominha) ao 6 (pra dois)
  hunger: [
    { label: 'Só uma fominha', id: 'promo-artesanal-fritas', why: 'Leve, rápido e com fritas. Resolve sem pesar.' },
    { label: 'Fome de respeito', id: 'salada-bacon', why: 'Bacon, salada e fritas: o equilíbrio perfeito.' },
    { label: 'Fome brava', id: 'supremo', why: '200g de carne artesanal, bacon, ovo e cebola caramelizada.' },
    { label: 'Fome de monstro', id: 'prime-double', why: '400g de carne artesanal. Não é pra amador.' },
    { label: 'Fome de pedreiro', id: 'combo-fome-pedreiro', why: 'Supremo + batata grande + refri 600ml. Missão cumprida.' },
    { label: 'Fome pra dois', id: 'combo-clt', why: '2 Rústicos Tudo, 2 batatas e 2 bebidas. Divide se quiser.' },
  ],
};
