
let pacificas = [
  "assets1/gettyimages-2301815418-612x612.jpg",
  "assets1/gettyimages-2302274914-612x612.jpg",
  "assets1/gettyimages-458234247-2048x2048.jpg",
  "assets1/gettyimages-2061701572-612x612.jpg",
  "assets1/gettyimages-2300695208-612x612.jpg",
  "assets1/gettyimages-2300731110-612x612.jpg",
  "assets1/gettyimages-1960630877-612x612.jpg",
  "assets1/gettyimages-2175270581-612x612.jpg",
  "assets1/gettyimages-1393624185-612x612.jpg"
  
];

let agressivas = [
  "assets/gettyimages-2302575651-612x612.jpg",
  "assets/gettyimages-2302485447-612x612.jpg",
  "assets/gettyimages-2302485345-612x612.jpg",
  "assets/gettyimages-2302485567-612x612.jpg",
  "assets/gettyimages-2301377467-612x612.jpg",
  "assets/gettyimages-2302485365-612x612.jpg",
  "assets/gettyimages-2302485611-612x612.jpg"
];

let imagensPac = [];
let imagensAgr = [];
let imagensAtivas = [];

let velocidade = 0;
let xAnterior = 0;
let yAnterior = 0;
let ultimoSpawn = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  // Carregar fotografias pacíficas
  for (let ficheiro of pacificas) {
    loadImage(
      ficheiro,
      img => imagensPac.push(img),
      erro => console.log("Erro ao carregar:", ficheiro)
    );
  }

  // Carregar fotografias mais agressivas
  for (let ficheiro of agressivas) {
    loadImage(
      ficheiro,
      img => imagensAgr.push(img),
      erro => console.log("Erro ao carregar:", ficheiro)
    );
  }
}

function draw() {
  background(0);

  // Calcular velocidade do rato
  let movimento = dist(mouseX, mouseY, xAnterior, yAnterior);
  velocidade = lerp(velocidade, movimento, 0.3);

  xAnterior = mouseX;
  yAnterior = mouseY;

  // Rato mais rápido = imagens mais frequentes
  let intervalo = map(
    constrain(velocidade, 0, 35),
    0, 35,
    700, 60
  );

  if (velocidade > 1 && millis() - ultimoSpawn > intervalo) {
    criarImagem();
    ultimoSpawn = millis();
  }

  // Mostrar fotografias
  for (let i = imagensAtivas.length - 1; i >= 0; i--) {
    let p = imagensAtivas[i];

    p.vida--;

    if (p.vida <= 0) {
      imagensAtivas.splice(i, 1);
      continue;
    }

    let opacidade = map(p.vida, 0, p.vidaMax, 0, 255);

    push();
    translate(p.x, p.y);
    rotate(p.angulo);

    imageMode(CENTER);
    tint(255, opacidade);

    let altura = p.tamanho / (p.img.width / p.img.height);

    image(p.img, 0, 0, p.tamanho, altura);

    pop();
  }
}

function criarImagem() {
  let rapido = velocidade > 17;

  // Escolher fotografias conforme a velocidade
  let grupo = rapido ? imagensAgr : imagensPac;

  // Não utilizar imagens de outro grupo
  if (grupo.length === 0) return;

  let foto = random(grupo);

  let intensidade = constrain(velocidade, 0, 35);

  let tamanho = map(intensidade, 0, 35, 150, 420);
  let vida = 150;

  imagensAtivas.push({
    img: foto,
    x: mouseX + random(-35, 35),
    y: mouseY + random(-35, 35),
    tamanho: tamanho,
    angulo: random(-0.08, 0.08),
    vida: vida,
    vidaMax: vida
  });

  if (imagensAtivas.length > 35) {
    imagensAtivas.shift();
  }
}

function mousePressed() {
  criarImagem();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
