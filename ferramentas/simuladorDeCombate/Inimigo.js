import Personagem from "./Personagem.js";

export default class Inimigo extends Personagem {
    constructor(canvas = null, cena = null) {
        super(canvas, cena);
        this.pontosExperiencia = 5;
        this.cooldown = 3;
    }

    desenhar() {
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "right";
        this.ctx.fillText("Inimigo", 0.95 * this.canvas.width,
            0.3 * this.canvas.height);
        this.ctx.fillText("Vida: ", 0.85 * this.canvas.width - 25,
            0.65 * this.canvas.height);
        this.ctx.fillText(this.vidaAtual, 0.85 * this.canvas.width,
            0.65 * this.canvas.height);

        // Barra de cooldown
        let x = 0.925 * this.canvas.width - (0.25 * this.canvas.width);
        let y = 0.7 * this.canvas.height;
        this.desenhaBarraDeAtaque(x, y);
    }

    resetar() {
        this.calcularDificuldade();
        this.vidaAtual = this.vidaMaxima;
    }

    controle() {
        super.controle();
        if (this.vidaAtual <= 0) {
            this.resetar();
        }
    }

    sofrerDano(jogador) {
        super.sofrerDano(jogador);
        if (this.vidaAtual <= 0) {
            jogador.experienciaAtual += this.pontosExperiencia;
            this.resetar();
        }
    }

    calcularDificuldade() {
        this.pontosExperiencia = this.pontosExperiencia + 5;;
        this.vidaMaxima = this.vidaMaxima + 20;
    }

    atacar() {
        console.log("inimigo atacou");
    }



}