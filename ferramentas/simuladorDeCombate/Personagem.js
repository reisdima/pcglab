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
            this.atacar(); console.log(this.cooldown);
            this.contador = this.cooldown;
        }
    }

    sofrerDano(personagem) {
        let dano = personagem.atributos["forca"].valor;
        this.vidaAtual -= (dano - this.defesa);
    }

    atacar() {

    }
}