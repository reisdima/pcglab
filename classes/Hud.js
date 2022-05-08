import { converteTelaCheia, escreveTexto } from "./Utils.js";
import { getPlayer } from "./Entities/Player.js";

// Main Menu campos
const fontMainMenu = "30px Arial Black";
const wordsColor = "white";
const alignMainMenu = "center";

// HUD
const hud = {
  tempo: { x: 0, y: 0, text: "Tempo: " },
  energia: { x: 0, y: 0, text: "Energia: " },
  vidas: { x: 0, y: 0, text: "Vidas: " },
  tesouros: { x: 0, y: 0, text: "Tesouros: " },
  bussola: {
    centerX: 0,
    centerY: 0,
    raio: 40,
    color: "rgba(10, 10, 10, 0.6)",
    stroke: "rgba(105, 105, 105, 0.4)",
    sAngle: 0,
    eAngle: Math.PI * 2,
    counterclockwise: false,
    salaPlayer: null,
    tesouros: null,
    inimigos: null,
    teleporteInitial: null,
    teleporteFinal: null,
    mapMode: 0,
    mapModeText: [],
    desenhar: function (ctx) {
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
        case 3:
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
    },

    update: function (levelAtual) {
      this.salaPlayer = levelAtual.getPlayerRoom();
      this.tesouros = this.salaPlayer.treasures;
      this.inimigos = this.salaPlayer.enemies;
      this.teleporteInitial = this.salaPlayer.teleporterInitial;
      this.teleporteFinal = this.salaPlayer.teleporterFinal;
    },

    init: function () {
      this.mapModeText.push("Todos");
      this.mapModeText.push("Teleportes");
      this.mapModeText.push("Inimigos");
      this.mapModeText.push("Tesouros");
    },
  },

  level: { x: 0, y: 0, text: "Level: " },
  debugText: [],
  init: function (tela) {
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
    this.updateElementos(tela);
    this.bussola.init();
  },
  updateElementos: function (tela) {
    this.tempo.x = converteTelaCheia(40, tela.widthOld, tela.width);
    this.tempo.y = converteTelaCheia(20, tela.heightOld, tela.height);
    this.energia.x = converteTelaCheia(200, tela.widthOld, tela.width);
    this.energia.y = converteTelaCheia(20, tela.heightOld, tela.height);
    this.vidas.x = converteTelaCheia(350, tela.widthOld, tela.width);
    this.vidas.y = converteTelaCheia(20, tela.heightOld, tela.height);
    this.tesouros.x = converteTelaCheia(450, tela.widthOld, tela.width);
    this.tesouros.y = converteTelaCheia(20, tela.heightOld, tela.height);
    this.level.x = converteTelaCheia(545, tela.widthOld, tela.width);
    this.level.y = converteTelaCheia(20, tela.heightOld, tela.height);
    this.bussola.centerX = converteTelaCheia(545, tela.widthOld, tela.width);
    this.bussola.centerY = converteTelaCheia(250, tela.heightOld, tela.height);
    this.bussola.raio = converteTelaCheia(20, tela.heightOld, tela.height);
  },
};

export function getHud() {
  return hud;
}

export function setHud(_hud) {
  hud = _hud;
}
