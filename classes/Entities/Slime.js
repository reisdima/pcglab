import { slime_atributos_base, slime_crescimento_por_nivel } from "./EnemiesBaseAttributes.js";
import Enemy from "./Enemy.js";

export default class Slime extends Enemy {
    constructor(nivel) {
        super({ s: 22, w: 22, h: 10, nomeImagem: "slime", sizeImagem: 22 }, nivel);
        this.matrizImagem = {
            linha: 1,
            colunas: 9,
            widthImagem: 22,
            heightImagem: 22
        };
        this.qtdAnimacoes = { types: 2, lines: [1, 0], qtd: [3, 9] /* atacking: 9, normal: 3*/ };
        this.speedAnimation = 11.49; //1.2;
        this.xpFornecida = 50;
        this.cooldownAtaque = 8;                  //Tempo travado até terminar o ataque            
        this.atributos = Object.assign({}, slime_atributos_base);
        this.taxas_crescimento = Object.assign({}, slime_crescimento_por_nivel);
        this.criarAnimacoes();
    }

    balancearDificuldade() {
        for (const keyAtributo in this.atributos) {
            const valorBase = this.atributos[keyAtributo];
            let novoValor = Math.round(valorBase * Math.pow(slime_crescimento_por_nivel[keyAtributo], (this.nivel - 1)));
            this.atributos[keyAtributo] = novoValor;
        }
        this.hpAtual = this.atributos.hpMax;
        this.calcularPoderTotal();
    }

    // distribuirPoder(poder) {
    //     let velocidade = this.getRandomInt(1, poder);
    //     while ((velocidade / 2) + inimigo.atributos.velocidade > inimigo.atributos.velocidadeMaxima) {
    //         velocidade = this.getRandomInt(1, poder);
    //     }
    //     poder -= velocidade;
        
    //     let ataque = this.getRandomInt(1, poder);
    //     poder -= ataque;
        
    //     let hp = poder;
        
    //     this.atributos.ataque = ataque;
    //     this.atributos.velocidade += velocidade / 2;
    //     this.atributos.hpMax = hp / 2;
    //     this.hpAtual = hp / 2;
    //     this.calcularPoderTotal();
    // }
}