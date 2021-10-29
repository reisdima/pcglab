import Personagem from "./Personagem.js";

export default class Inimigo extends Personagem {
    constructor(canvas = null, cena = null) {
        super(canvas, cena);
        this.pontosExperiencia = 5;
    }

    resetar() {
        this.calcularDificuldade();
        this.vidaAtual = this.vidaMaxima;
    }

    controle() {
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




}