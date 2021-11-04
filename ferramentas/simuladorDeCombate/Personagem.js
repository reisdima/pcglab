export default class Personagem {
    constructor(canvas = null, cena = null) {
        this.canvas = canvas;
        this.ctx = canvas?.getContext("2d");
        this.cena = cena;
        this.vidaAtual = 5;
        this.vidaMaxima = 5;
        this.contador = 3;
        this.cooldown = 3;
        this.defesa = 0;
    }


    controle() {
        this.contador -= this.cena.dt;
        if (this.contador <= 0) {
            this.atacar();
            this.contador = this.cooldown;
        }
    }

    sofrerDano(personagem) {
        let dano = personagem.atributos["forca"].valor;
        this.vidaAtual -= (dano - this.defesa);
    }

    atacar() {

    }

    desenhaBarraDeAtaque(x, y, width, height) {
        const w = width ?? 0.25 * this.canvas.width;
        const h = height ?? 0.01 * this.canvas.height;
        const sr = (this.cooldown - this.contador) / this.cooldown;
        // background
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(x, y, w, h);
        //filling bar
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(x, y, w * sr, h);
        // border
        this.ctx.strokeStyle = "hsl(120,50%,25%)";
        this.ctx.lineWidth = h / 3;
        this.ctx.strokeRect(x, y, w, h);
    }
}