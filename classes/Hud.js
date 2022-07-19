import { converteTelaCheia, escreveTexto } from "./Utils.js";
import { getPlayer } from "./Entities/Player.js";

// Main Menu campos
const fontMainMenu = "30px Arial Black";
const wordsColor = "white";
const alignMainMenu = "center";

class Bussola {
  constructor() {
    this.centerX = 0;
    this.centerY = 0;
    this.raio = 40;
    this.color = "rgba(10, 10, 10, 0.6)";
    this.stroke = "rgba(105, 105, 105, 0.4)";
    this.sAngle = 0;
    this.eAngle = Math.PI * 2;
    this.counterclockwise = false;
    this.salaPlayer = null;
    this.tesouros = null;
    this.inimigos = null;
    this.teleporteInitial = null;
    this.teleporteFinal = null;
    this.mapMode = 0;
    this.mapModeText = [];
  }

  desenhar(ctx) {
    ctx.linewidth = 1;
    ctx.fillStyle = this.color; //"rgba(10, 10, 10, 0.4)";
    ctx.strokeStyle = this.stroke; //"rgba(10, 10, 10, 0.4)";
    //  Circulo de fora
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      this.centerX,
      this.centerY,
      this.raio,
      this.sAngle,
      this.eAngle,
      this.counterclockwise
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    switch (this.mapMode) {
      case 0:
        {
          // Todos
          for (let i = 0; i < this.tesouros.length; i++) {
            let vetorUnitario = {
              x: this.tesouros[i].x - getPlayer().x,
              y: this.tesouros[i].y - getPlayer().y,
              modulo: 0,
            };
            vetorUnitario.modulo = Math.sqrt(
              vetorUnitario.x * vetorUnitario.x +
              vetorUnitario.y * vetorUnitario.y
            );
            vetorUnitario.x = vetorUnitario.x / vetorUnitario.modulo;
            vetorUnitario.y = vetorUnitario.y / vetorUnitario.modulo;

            ctx.save();
            ctx.strokeStyle = "yellow"; // linha de acabamento preta pra facilitar a visualização
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.centerY);
            ctx.lineTo(
              this.centerX + vetorUnitario.x * (this.raio / 2),
              this.centerY + vetorUnitario.y * (this.raio / 2)
            );
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
          }

          for (let i = 0; i < this.inimigos.length; i++) {
            // Ligação entre os teleportes
            let vetorUnitario = {
              x: this.inimigos[i].x - getPlayer().x,
              y: this.inimigos[i].y - getPlayer().y,
              modulo: 0,
            };
            vetorUnitario.modulo = Math.sqrt(
              vetorUnitario.x * vetorUnitario.x +
              vetorUnitario.y * vetorUnitario.y
            );
            vetorUnitario.x = vetorUnitario.x / vetorUnitario.modulo;
            vetorUnitario.y = vetorUnitario.y / vetorUnitario.modulo;

            ctx.save();
            ctx.strokeStyle = "red"; // linha de acabamento preta pra facilitar a visualização
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.centerY);
            ctx.lineTo(
              this.centerX + vetorUnitario.x * (this.raio / 2),
              this.centerY + vetorUnitario.y * (this.raio / 2)
            );
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
          }

          let vetorUnitario = {
            x: this.teleporteInitial.x - getPlayer().x,
            y: this.teleporteInitial.y - getPlayer().y,
            modulo: 0,
          };
          vetorUnitario.modulo = Math.sqrt(
            vetorUnitario.x * vetorUnitario.x +
            vetorUnitario.y * vetorUnitario.y
          );
          vetorUnitario.x = vetorUnitario.x / vetorUnitario.modulo;
          vetorUnitario.y = vetorUnitario.y / vetorUnitario.modulo;

          ctx.save();
          ctx.strokeStyle = "green"; // linha de acabamento preta pra facilitar a visualização
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.centerX, this.centerY);
          ctx.lineTo(
            this.centerX + vetorUnitario.x * (this.raio / 2),
            this.centerY + vetorUnitario.y * (this.raio / 2)
          );
          ctx.closePath();
          ctx.stroke();
          ctx.restore();

          vetorUnitario = {
            x: this.teleporteFinal.x - getPlayer().x,
            y: this.teleporteFinal.y - getPlayer().y,
            modulo: 0,
          };
          vetorUnitario.modulo = Math.sqrt(
            vetorUnitario.x * vetorUnitario.x +
            vetorUnitario.y * vetorUnitario.y
          );
          vetorUnitario.x = vetorUnitario.x / vetorUnitario.modulo;
          vetorUnitario.y = vetorUnitario.y / vetorUnitario.modulo;

          ctx.save();
          ctx.strokeStyle = "green"; // linha de acabamento preta pra facilitar a visualização
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.centerX, this.centerY);
          ctx.lineTo(
            this.centerX + vetorUnitario.x * (this.raio / 2),
            this.centerY + vetorUnitario.y * (this.raio / 2)
          );
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
        break;
      case 1:
        {
          //Teleportes
          let vetorUnitario = {
            x: this.teleporteInitial.x - getPlayer().x,
            y: this.teleporteInitial.y - getPlayer().y,
            modulo: 0,
          };
          vetorUnitario.modulo = Math.sqrt(
            vetorUnitario.x * vetorUnitario.x +
            vetorUnitario.y * vetorUnitario.y
          );
          vetorUnitario.x = vetorUnitario.x / vetorUnitario.modulo;
          vetorUnitario.y = vetorUnitario.y / vetorUnitario.modulo;

          ctx.save();
          ctx.strokeStyle = "green"; // linha de acabamento preta pra facilitar a visualização
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.centerX, this.centerY);
          ctx.lineTo(
            this.centerX + vetorUnitario.x * (this.raio / 2),
            this.centerY + vetorUnitario.y * (this.raio / 2)
          );
          ctx.closePath();
          ctx.stroke();
          ctx.restore();

          vetorUnitario = {
            x: this.teleporteFinal.x - getPlayer().x,
            y: this.teleporteFinal.y - getPlayer().y,
            modulo: 0,
          };
          vetorUnitario.modulo = Math.sqrt(
            vetorUnitario.x * vetorUnitario.x +
            vetorUnitario.y * vetorUnitario.y
          );
          vetorUnitario.x = vetorUnitario.x / vetorUnitario.modulo;
          vetorUnitario.y = vetorUnitario.y / vetorUnitario.modulo;

          ctx.save();
          ctx.strokeStyle = "green"; // linha de acabamento preta pra facilitar a visualização
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.centerX, this.centerY);
          ctx.lineTo(
            this.centerX + vetorUnitario.x * (this.raio / 2),
            this.centerY + vetorUnitario.y * (this.raio / 2)
          );
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
        break;
      case 2:
        {
          // Inimigos
          for (let i = 0; i < this.inimigos.length; i++) {
            // Ligação entre os teleportes
            let vetorUnitario = {
              x: this.inimigos[i].x - getPlayer().x,
              y: this.inimigos[i].y - getPlayer().y,
              modulo: 0,
            };
            vetorUnitario.modulo = Math.sqrt(
              vetorUnitario.x * vetorUnitario.x +
              vetorUnitario.y * vetorUnitario.y
            );
            vetorUnitario.x = vetorUnitario.x / vetorUnitario.modulo;
            vetorUnitario.y = vetorUnitario.y / vetorUnitario.modulo;

            ctx.save();
            ctx.strokeStyle = "red"; // linha de acabamento preta pra facilitar a visualização
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.centerY);
            ctx.lineTo(
              this.centerX + vetorUnitario.x * (this.raio / 2),
              this.centerY + vetorUnitario.y * (this.raio / 2)
            );
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
          }
        }
        break;
      case 3: // Tesouros
        {
          for (let i = 0; i < this.tesouros.length; i++) {
            let vetorUnitario = {
              x: this.tesouros[i].x - getPlayer().x,
              y: this.tesouros[i].y - getPlayer().y,
              modulo: 0,
            };
            vetorUnitario.modulo = Math.sqrt(
              vetorUnitario.x * vetorUnitario.x +
              vetorUnitario.y * vetorUnitario.y
            );
            vetorUnitario.x = vetorUnitario.x / vetorUnitario.modulo;
            vetorUnitario.y = vetorUnitario.y / vetorUnitario.modulo;

            ctx.save();
            ctx.strokeStyle = "yellow"; // linha de acabamento preta pra facilitar a visualização
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.centerY);
            ctx.lineTo(
              this.centerX + vetorUnitario.x * (this.raio / 2),
              this.centerY + vetorUnitario.y * (this.raio / 2)
            );
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
          }
        }
        break;
    }

    // centro
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = "yellow";
    ctx.arc(
      this.centerX,
      this.centerY,
      2,
      this.sAngle,
      this.eAngle,
      this.counterclockwise
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Titulo
    ctx.fillStyle = wordsColor;
    ctx.textAlign = alignMainMenu;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    escreveTexto(
      ctx,
      this.mapMode + 1 + " - " + this.mapModeText[this.mapMode],
      this.centerX,
      this.centerY + this.raio + this.raio / 2
    );
  }

  update(levelAtual) {
    this.salaPlayer = levelAtual.getPlayerRoom();
    this.tesouros = this.salaPlayer.treasures;
    this.inimigos = this.salaPlayer.enemies;
    this.teleporteInitial = this.salaPlayer.teleporterInitial;
    this.teleporteFinal = this.salaPlayer.teleporterFinal;
  }

  init() {
    this.mapModeText.push("Todos");
    this.mapModeText.push("Teleportes");
    this.mapModeText.push("Inimigos");
    this.mapModeText.push("Tesouros");
  }

}


export default class Hud {

  static #instance;

  constructor() {
    if(Hud.#instance) {
      throw 'Error ao instancia HUD'
    }
    this.tempo = { x: 0, y: 0, text: "Tempo: " };
    this.energia = { x: 0, y: 0, text: "Energia: " };
    this.vidas = { x: 0, y: 0, text: "Vidas: " };
    this.tesouros = { x: 0, y: 0, text: "Tesouros: " };
    this.level = { x: 0, y: 0, text: "Level: " };

    this.atributos = { x: 0, y: 0, text: "Atributos" };
    this.vida = { x: 0, y: 0, text: "Vida: " };
    this.dano = { x: 0, y: 0, text: "Dano: " };
    this.velocidade = { x: 0, y: 0, text: "Velocidade: " };

    this.debugText = [];
    this.botoes = [];
    this.bussola = new Bussola();
  }

  static getInstance() {
    if(!Hud.#instance) {
      Hud.#instance = new Hud();
    }
    return Hud.#instance;
  }


  init(canvas) {
    this.debugText.push("Mode 1 - Tipo da celula");
    this.debugText.push("Mode 2 - Room da celula");
    this.debugText.push("Mode 3 - Ligação dos Teleportes"); // Centro do personagem e celula marcada
    this.debugText.push("Mode 4 - Caixa de Colisão"); // Box collision
    this.debugText.push("Mode 5 - Distancia - Teleportes"); // Dados das celulas -- DistTeleportes
    this.debugText.push("Mode 6 - Distancia - Firezones"); // Dados das celulas -- DistFirezones
    this.debugText.push("Mode 7 - Distancia - Inimigos"); // Dados das celulas -- DistInimigos
    this.debugText.push("Mode 8 - Distancia - Tesouros"); // Dados das celulas -- DistTesouros
    this.debugText.push("Mode 9 - Dist - Inimigos + Teleportes"); // Dados das celulas -- DistTesouros
    this.debugText.push("Mode 10 - Dist - Inimigos + Telep.. + Fire.."); // Dados das celulas -- DistInimigosTeleporte
    this.debugText.push("Mode 11 - GPS até a saída do Room");
    this.debugText.push("Mode 12 - Caminho Teleporte - Teleporte");
    this.debugText.push("Mode 13 - Caminho Tesouros");
    this.debugText.push("Mode 14 - Caminho do Player");
    this.debugText.push("Mode 15 - Sobreposição de caminhos");
    this.debugText.push("Mode 16 - Gráfico Entrada-Saída");
    this.debugText.push("Mode 17 - Gráfico Entrada-Tesouros-Saída");
    this.debugText.push("Mode 18 - Gráfico Caminho do Player");
    this.updateElementos(canvas);
    this.bussola.init();
  }

  updateElementos(canvas) {
    this.tempo.x = converteTelaCheia(40, canvas.widthOld, canvas.width);
    this.tempo.y = converteTelaCheia(20, canvas.heightOld, canvas.height);
    this.energia.x = converteTelaCheia(200, canvas.widthOld, canvas.width);
    this.energia.y = converteTelaCheia(20, canvas.heightOld, canvas.height);
    this.vidas.x = converteTelaCheia(350, canvas.widthOld, canvas.width);
    this.vidas.y = converteTelaCheia(20, canvas.heightOld, canvas.height);
    this.tesouros.x = converteTelaCheia(450, canvas.widthOld, canvas.width);
    this.tesouros.y = converteTelaCheia(20, canvas.heightOld, canvas.height);
    this.level.x = converteTelaCheia(545, canvas.widthOld, canvas.width);
    this.level.y = converteTelaCheia(20, canvas.heightOld, canvas.height);
    this.bussola.centerX = converteTelaCheia(545, canvas.widthOld, canvas.width);
    this.bussola.centerY = converteTelaCheia(250, canvas.heightOld, canvas.height);
    this.bussola.raio = converteTelaCheia(20, canvas.heightOld, canvas.height);


    this.atributos.x = converteTelaCheia(500, canvas.widthOld, canvas.width);
    this.atributos.y = converteTelaCheia(60, canvas.heightOld, canvas.height);
    this.dano.x = converteTelaCheia(480, canvas.widthOld, canvas.width);
    this.dano.y = converteTelaCheia(80, canvas.heightOld, canvas.height);
    this.vida.x = converteTelaCheia(480, canvas.widthOld, canvas.width);
    this.vida.y = converteTelaCheia(100, canvas.heightOld, canvas.height);
    this.velocidade.x = converteTelaCheia(480, canvas.widthOld, canvas.width);
    this.velocidade.y = converteTelaCheia(120, canvas.heightOld, canvas.height);
  }

  adicionarBotao(botao) {
    this.botoes.push(botao);
  }

  desenharBotoes(ctx, assets) {
    this.botoes.forEach(botao => {
      botao.desenhar(ctx, assets);
    });
  }

  limparBotoes() {
    this.botoes = [];
  }

}