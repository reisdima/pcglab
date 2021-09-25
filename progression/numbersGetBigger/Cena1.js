import Cena from "./Cena.js";
import Sprite from "../../js/Sprite.js";

export default class Cena1 extends Cena {
  constructor(canvas = null, assets = null) {
    super(canvas, assets);
    this.resources = [
      {
        label: "A",
        quantity: 0,
        currentCost: 15,
        initialCost: 15,
        currentAddition: 0,
        addition: 0.1,
      },
      {
        label: "B",
        quantity: 0,
        currentCost: 100,
        initialCost: 100,
        currentAddition: 0,
        addition: 0.5,
      },
      {
        label: "C",
        quantity: 0,
        currentCost: 500,
        initialCost: 500,
        currentAddition: 0,
        addition: 4,
      },
    ];
    this.scoreRate = 0;
    this.currentScore = 15;
    this.counter = 0;
    this.spacePressed = false;
  }

  desenhar() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = "20px Times";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "left";
    this.ctx.fillText("Pontos: ", 100, 75);
    this.ctx.fillText(this.currentScore, 175, 75);
    this.ctx.fillText("Taxa: ", 100, 100);
    this.ctx.fillText(this.scoreRate, 175, 100);
    this.desenharTabela();
  }

  desenharTabela() {
    let startX = 20;
    let startY = 150;
    let offsetX = 150;
    let offsetY = 50;
    // this.ctx.textAlign = "center";
    this.ctx.fillText("Recurso", startX, startY);
    this.ctx.fillText("Incremento", startX + offsetX, startY);
    this.ctx.fillText("Incremento total", startX + 2 * offsetX, startY);
    this.ctx.fillText("Quantidade", startX + 3 * offsetX, startY);
    this.ctx.fillText("Custo", startX + 4 * offsetX, startY);
    startY += offsetY;
    this.resources.forEach((resource) => {
      this.ctx.fillText(resource.label, startX, startY);
      this.ctx.fillText(resource.addition, startX + offsetX, startY);
      this.ctx.fillText(
        parseFloat((resource.addition * resource.quantity).toFixed(10)),
        startX + 2 * offsetX,
        startY
      );
      this.ctx.fillText(resource.quantity, startX + 3 * offsetX, startY);
      this.ctx.fillText(resource.currentCost, startX + 4 * offsetX, startY);
      startY += offsetY;
    });
  }

  quadro(t) {
    super.quadro(t);
    this.counter += this.dt;
    this.controle();
    this.currentScore = parseFloat(
      (this.currentScore + this.scoreRate*this.dt).toFixed(10)
    );
    if (this.counter >= 1) {
      this.counter = 0;
    }
  }

  controle() {
    for (let i = 0; i < this.resources.length; i++) {
      const element = this.resources[i];
      if (this.input.comandos.get(element.label)) {
        if (this.currentScore >= element.currentCost) {
          this.currentScore = parseFloat(
            (this.currentScore - element.currentCost).toFixed(10)
          );
          element.quantity++;
          element.currentCost = Math.round(
            element.initialCost * Math.pow(1.15, element.quantity)
          );
          this.scoreRate = parseFloat(
            (this.scoreRate + element.addition).toFixed(10)
          );
        }
        return;
      }
    }
    if (this.input.comandos.get("MAKE_POINT")) {
      if (!this.spacePressed) {
        this.spacePressed = true;
        this.currentScore = parseFloat(
          (
            this.currentScore +
            1 +
            this.resources[0].quantity * this.resources[0].addition
          ).toFixed(10)
        );
      }
    } else {
      this.spacePressed = false;
    }
  }

  quandoColidir(a, b) {
    // if(a.tags.has("pc") && b.tags.has("coin")){
    //     if(!this.aRemover.includes(b)){
    //         this.aRemover.push(b);
    //         a.distancias.clear();
    //     }
    //     this.game.moedas += 1;
    // }
    // if(a.tags.has("pc") && b.tags.has("exit")){ // Se pc colidir com saída, remove os dois e reinicia a cena
    //     if(!this.aRemover.includes(a)){
    //         this.aRemover.push(a);
    //     }
    //     if(!this.aRemover.includes(b)){
    //         this.aRemover.push(b);
    //     }
    //     this.game.selecionaCena("fase1");
    // }
  }

  preparar() {
    super.preparar();

    // // Desenha o mapa
    // const mapa1 = new Mapa(8, 12, 48);
    // mapa1.carregaMapa(modeloMapaFase1);
    // this.configuraMapa(mapa1);

    // // Cria entrada
    // const entrada = new Sprite({x: 65, y: randValue(65,310), w: 20, h: 20, color:"yellow", tags:["entrada"]});
    // this.adicionar(entrada);

    // // Desenha o pc
    // const pc = new Sprite({x: entrada.x, y :entrada.y, w: 15, h: 15, color: "red"});
    // pc.tags.add("pc");

    // const cena = this;

    // // Define controle do pc

    // pc.controlar = caminhoMinimo;

    // this.adicionar(pc);

    // // Cria saída
    // const exit = new Sprite({x: 510, y: randValue(65,310), w: 20, h: 20, tags:["exit"]});
    // this.adicionar(exit);

    // // Cria moedas
    // let qtdMoedas = randValue(4,8);
    // for (let i = 0; i < qtdMoedas; i++) {
    //     this.adicionar(new Sprite({x: randValue(100, 450), y: randValue(65, 310), w: 16, h: 16, tags:["coin"]}));
    // }
    // //this.adicionar(new Sprite({x: randValue(65, 510), y: randValue(65, 310), w: 16, h: 16}));  // Sprite que deve ser ignorado pelo pc

    // //Função de movimentação pelo teclado
    // function movimentoTeclado(dt){
    //     if(cena.input.comandos.get("MOVE_ESQUERDA")){
    //         this.direcao = "esq";
    //         this.vx = -150;
    //     } else if (cena.input.comandos.get("MOVE_DIREITA")){
    //         this.direcao = "dir";
    //         this.vx = +150;
    //     } else {
    //         this.vx = 0;
    //     }
    //     if(cena.input.comandos.get("MOVE_CIMA")){
    //         this.direcao = "cima";
    //         this.vy = -150;
    //     } else if (cena.input.comandos.get("MOVE_BAIXO")){
    //         this.direcao = "baixo";
    //         this.vy = +150;
    //     } else {
    //         this.vy = 0;
    //     }
    //     if(cena.input.comandos.get("VER_DISTANCIAS")){
    //         console.log(this.distancias);
    //     }

    //     atualizaDistancias();
    // };

    // // Função de estatica
    // function estatico(dt){
    //     if(cena.input.comandos.get("VER_DISTANCIAS")){
    //         console.log(this.distancias);
    //     }
    //     atualizaDistancias();
    // }

    // // Função de movimentação por perseguição
    // function perseguePC(dt){
    //     this.vx = 40*Math.sign(pc.x - this.x);
    //     this.vy = 40*Math.sign(pc.y - this.y);
    // }

    // //Função de caminho aleatório
    // function caminhoAleatorio(dt){
    //     for (let i = 0; i < cena.sprites.length; i++) {
    //         if(cena.sprites[i].tags.has("coin")){
    //             this.vx = 100*Math.sign(cena.sprites[i].x - this.x);
    //             this.vy = 100*Math.sign(cena.sprites[i].y - this.y);
    //         }
    //         if(!cena.sprites[i].tags.has("coin")){
    //             this.vx = 100*Math.sign(exit.x - this.x);
    //             this.vy = 100*Math.sign(exit.y - this.y);
    //         }
    //     }

    //     if(cena.input.comandos.get("VER_DISTANCIAS")){
    //         console.log(this.distancias);
    //     }

    //     atualizaDistancias();
    // }

    // //Função de caminho mínimo (adaptação do caixeiro viajante)
    // function caminhoMinimo(dt){
    //     let menorIndice = 0;
    //     let menorDist = 0;

    //     for (let d of pc.distancias) {
    //         if(menorDist === 0){
    //             menorIndice = d[0];
    //             menorDist = d[1];
    //         } else {
    //             if(menorDist > d[1]){
    //                 menorIndice = d[0];
    //                 menorDist = d[1];
    //             }
    //         }
    //         this.vx = 100*Math.sign(cena.sprites[menorIndice].x - this.x);
    //         this.vy = 100*Math.sign(cena.sprites[menorIndice].y - this.y);
    //     }

    //     if(pc.distancias.size === 0){
    //         this.vy = 100*Math.sign(exit.y - this.y);
    //         this.vx = 100*Math.sign(exit.x - this.x);
    //     }

    //     if(cena.input.comandos.get("VER_DISTANCIAS")){
    //         console.log("Tamanho do map: " + pc.distancias.size);
    //         console.log(this.distancias);
    //         console.log(menorIndice);
    //         console.log(menorDist);
    //     }

    //     atualizaDistancias();
    // }

    // // Função geradora de valores aleatórios
    // function randValue(min, max) {
    //     min = Math.ceil(min);
    //     max = Math.floor(max);
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }

    // // Função de cálculo de distância entre dois pontos
    // function dist(a, b) {
    //     return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    // }

    // //Função que atualiza distâncias de pc aos demais sprites
    // function atualizaDistancias(){

    //     for (let i = 0; i < cena.sprites.length; i++) {
    //         if(cena.sprites[i].tags.has("coin")){
    //             pc.distancias.set(i,Math.floor(dist(pc, cena.sprites[i])));
    //         }
    //     }
    // }
  }

  desenharHud() {
    // Fase
    this.ctx.font = "15px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Moedas coletadas: " + this.game.moedas, 10, 20);
    this.ctx.fillText("Sprites na tela: " + this.sprites.length, 10, 40);
  }
}
