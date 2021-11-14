import Personagem from "./Personagem.js";

export default class Inimigo extends Personagem {
    constructor(canvas = null, cena = null) {
        super(canvas, cena);
        this.pontosExperiencia = 5;
        this.cooldown = 3;
    }

    desenhar() {
        let x = 0.7 * this.canvas.width;
        let y = 0.38 * this.canvas.height;
        super.desenhar(x, y);
        this.ctx.textAlign = "right";
        this.ctx.fillText("Inimigo", 0.95 * this.canvas.width,
            0.3 * this.canvas.height);



        this.ctx.textAlign = "center";
        x = 0.8 * this.canvas.width;
        y = 0.63 * this.canvas.height;

        this.ctx.fillText(this.vidaAtual + "/" + this.vidaMaxima, x, y);

        // Barra de cooldown
        x = 0.925 * this.canvas.width - (0.25 * this.canvas.width);
        y = 0.65 * this.canvas.height;
        this.desenharBarraDeVida(x, y);
        // x = 0.925 * this.canvas.width;
        y = 0.7 * this.canvas.height;
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

    sofrerDano(dano) {
        super.sofrerDano(dano);
        if (this.vidaAtual <= 0) {
            this.cena.jogador.experienciaAtual += this.pontosExperiencia;
            this.resetar();
        }
    }

    calcularDificuldade() {
        this.pontosExperiencia = this.pontosExperiencia + 5;;
        this.vidaMaxima = this.vidaMaxima + 20;
    }

    atacar() {
        this.cena.jogador.sofrerDano(1);
        console.log("inimigo atacou");
    }



}