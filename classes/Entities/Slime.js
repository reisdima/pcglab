import ProgressionManager from "../ProgressionManager.js";
import Character from "./Character.js";
import { PARAMETROS_SLIME } from "./EnemiesBaseAttributes.js";
import Enemy from "./Enemy.js";

export default class Slime extends Enemy {

    static getAtributosBase() {
        const atributos = Object.assign({}, PARAMETROS_SLIME.slime_atributos_base);
        return atributos;
    }

    static getValoresAtributosBase() {
        const valoresBase = Object.assign({}, PARAMETROS_SLIME.slime_valores_atributos_base);
        return valoresBase;
    }

    static getValoresAtributosAumentoPorPonto() {
        const valoresBase = Object.assign({}, PARAMETROS_SLIME.slime_valores_atributos_aumento_por_ponto);
        return valoresBase;
    }

    static getTaxaCrescimentoAtributos() {
        const taxasCrescimento = Object.assign({}, PARAMETROS_SLIME.slime_crescimento_por_nivel);
        return taxasCrescimento;
    }

    static getPesoHeuriscaDistribuicao() {
        const custoBase = Object.assign({}, PARAMETROS_SLIME.slime_custo_base);
        return custoBase;
    }

    static getPoderBase() {
        return ProgressionManager.calcularPoderTotal(Slime.getAtributosBase(), Slime.getTaxaCrescimentoAtributos());
    }

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
        this.poderAoMorrer = 50;
        this.cooldownAtaque = 8;                  //Tempo travado até terminar o ataque            
        this.atributos = Slime.getAtributosBase();
        this.taxasCrescimento = Slime.getTaxaCrescimentoAtributos();
        this.calcularAtributos();
        this.hpAtual = this.hpMax;
        this.poderTotal = ProgressionManager.calcularPoderTotal(this.atributos, this.taxasCrescimento);
        this.criarAnimacoes();
    }

    distribuirPoder(poder, seedGen) {
        let podeFazerUpgrade = true;
        const keys = Object.keys(this.atributos);
        while (poder > 0 && podeFazerUpgrade) {
            // let indexAtributo = this.selecionarAtributo('random');
            let indexAtributo = this.selecionarAtributo('heuristicaPorPeso', poder);
            // let indexAtributo = this.selecionarAtributo('menorCusto', poder);
            let valorAtributo = this.atributos[keys[indexAtributo]];
            if (indexAtributo >= 0) {
                const custoUpgrade = ProgressionManager.aplicarFuncaoDeProgressao(
                    valorAtributo,
                    PARAMETROS_SLIME.slime_custo_base[keys[indexAtributo]],
                    "cookie",
                    this.taxasCrescimento[keys[indexAtributo]]
                );
                poder -= custoUpgrade;
                this.atributos[keys[indexAtributo]] += 1;
            } else {
                podeFazerUpgrade = false;
            }
        }
    }

    selecionarAtributo(metodo = 'random', poderDisponivel) {
        let indexAtributo = 0;
        const keys = Object.keys(this.atributos);
        switch (metodo) {
            case 'random':
                indexAtributo = seedGen.nextRandInt(0, 3);
                break;
            case 'heuristicaPorPeso':
                let indexMelhor = -1;
                let custoBeneficioAtual = 0;
                keys.forEach((nomeAtributo, index) => {
                    const valorAtributo = this.atributos[nomeAtributo];
                    // const custoUpgrade = ProgressionManager.getCustoUpgrade(
                    //     valorAtributo,
                    //     nomeAtributo
                    // );
                    const custoUpgrade = ProgressionManager.aplicarFuncaoDeProgressao(
                        valorAtributo,
                        PARAMETROS_SLIME.slime_custo_base[nomeAtributo],
                        "cookie",
                        this.taxasCrescimento[nomeAtributo]
                    );
                    if (custoUpgrade <= poderDisponivel) {
                        let custoBeneficio = PARAMETROS_SLIME.slime_retorno_por_atributo[nomeAtributo] / custoUpgrade;
                        if (custoBeneficio > custoBeneficioAtual) {
                            indexMelhor = index;
                            custoBeneficioAtual = custoBeneficio;
                        }
                    }
                });
                indexAtributo = indexMelhor;
                break;
            case 'menorCusto':
                let indexMenorCusto = -1;
                let menorCusto = 0;
                keys.forEach((nomeAtributo, index) => {
                    const valorAtributo = this.atributos[nomeAtributo];
                    const custoUpgrade = ProgressionManager.aplicarFuncaoDeProgressao(
                        valorAtributo,
                        1,
                        "cookie",
                        this.taxasCrescimento[nomeAtributo]
                    );
                    if (custoUpgrade <= poderDisponivel) {
                        if (custoUpgrade < menorCusto) {
                            indexMenorCusto = index;
                            menorCusto = custoUpgrade;
                        }
                    }
                });
                indexAtributo = indexMenorCusto;
                break;
        
            default:
                indexAtributo = seedGen.nextRandInt(0, 3);
                break;
        }
        return indexAtributo;
    }

    // escolher atributo para aumentar

    calcularNivel(poder) {
        // this.poderTotal = poder;
        this.nivel = (Math.log10(poder) / (Math.log10(1.5)) << 0) - 2;
    }

}