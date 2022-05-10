export const fontMainMenu = "30px Arial Black";
export const wordsColor = "white";
export const alignMainMenu = "center";
export default class Cena {

    constructor(canvas = null, assets = null) {
        this.canvas = canvas;
        this.ctx = canvas?.getContext("2d");
        this.assets = assets;
        this.game = null;
    }

    desenhar() {
        this.limparTela();
        this.ctx.fillStyle = wordsColor;
        this.ctx.textAlign = alignMainMenu;
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "black";
        this.ctx.font = "40px Arial Black";
        this.ctx.strokeText("Maze Runner", this.canvas.width / 2, this.canvas.height / 3 - 50);
        this.ctx.fillText("Maze Runner", this.canvas.width / 2, this.canvas.height / 3 - 50);
        this.ctx.font = "15px Arial Black";
        this.ctx.font = fontMainMenu;

        this.ctx.fillStyle = "yellow";
        this.ctx.strokeText("New Game", this.canvas.width / 2, this.canvas.height / 2 - 60);
        this.ctx.fillText("New Game", this.canvas.width / 2, this.canvas.height / 2 - 60);
        this.ctx.fillStyle = wordsColor;
        this.ctx.strokeText("Quit", this.canvas.width / 2, this.canvas.height / 2 - 10);
        this.ctx.fillText("Quit", this.canvas.width / 2, this.canvas.height / 2 - 10);


    }

    adicionar(sprite) {
        sprite.cena = this;
        this.sprites.push(sprite);
    }

    passo(dt) {
        if (this.assets.acabou()) {
            for (const sprite of this.sprites) {
                sprite.passo(dt);
            }
        }
    }

    quadro(t) {
        this.t0 = this.t0 ?? t;
        this.dt = (t - this.t0) / 1000;
        // this.passo(this.dt);
        this.desenhar();
        // this.checaColisao();
        if (this.rodando) {
            this.idAnim = requestAnimationFrame((t) => { this.quadro(t); });
        }
        this.t0 = t;
    }

    iniciar() {
        this.rodando = true;
        this.idAnim = requestAnimationFrame((t) => { this.quadro(t); });
    }

    parar() {
        this.rodando = false;
        cancelAnimationFrame(this.idAnim);
        this.t0 = null;
        this.dt = 0;
    }

    checaColisao() {
        for (let a = 0; a < this.sprites.length - 1; a++) {
            const spriteA = this.sprites[a];
            for (let b = a + 1; b < this.sprites.length; b++) {
                const spriteB = this.sprites[b];
                if (spriteA.colidiuCom(spriteB)) {
                    this.quandoColidir(spriteA, spriteB);
                }
            }
        }
    }

    quandoColidir(a, b) {

    }

    configuraMapa(mapa) {
        this.mapa = mapa;
        this.mapa.cena = this;
    }

    configuraLayer(layer) {
        this.layer = layer;
        this.layer.cena = this;
    }

    configuraPath(path) {
        this.path = path;
        this.path.cena = this;
    }

    preparar() {
        this.sprites = [];
        this.aRemover = [];
        this.t0 = null;
        this.dt = 0;
        this.idAnim = null;
        this.mapa = null;
        this.layer = null;
        this.path = null;
        this.rodando = true;
    }

    desenharHud() {

    }

    limparTela() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // capturarInput() {
    //     if (this.input.comandos.get("F")) {
    //         fullscreen = !fullscreen;
    //         if (fullscreen) {
    //             openFullscreen();
    //         }
    //         else {
    //             closeFullscreen();
    //         }
    //         break;
    //         return;
    //     }
    // }
}