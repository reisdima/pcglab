import Personagem from "./Personagem.js";

export default class Jogador extends Personagem {
    constructor(canvas = null, cena = null) {
        super(canvas, cena);
        this.atributos = {
            vida: {
                nome: "Vida",
                quantidade: 1,
                custoAtual: 15,
                custoInicial: 15,
                valor: 50,
                fator: 1,
            },
            forca: {
                nome: "Força",
                quantidade: 1,
                custoAtual: 15,
                custoInicial: 15,
                valor: 1,
                fator: 1,
            },
            defesa: {
                nome: "Defesa",
                quantidade: 1,
                custoAtual: 15,
                custoInicial: 15,
                valor: 50,
                fator: 1,
            },
            velocidade: {
                nome: "Velocidade",
                quantidade: 1,
                custoAtual: 15,
                custoInicial: 15,
                valor: 1,
                fator: 1,
            }
        }
        this.experienciaAtual = 10;
        this.experienciaNivel = 10;
        this.nivel = 1;
        this.pontosAtributos = 0;
        this.cooldown = 0.2 + ((3 - this.atributos['velocidade'].valor) < 0 ? 0 : 3 - this.atributos['velocidade'].valor)
    }



    controle() {
        super.controle();
    }

    atacar() {
        this.cena.inimigo.sofrerDano(this);
    }

    desenhar() {
        this.ctx.textAlign = "left";
        this.ctx.fillText("Jogador", 0.05 * this.canvas.width,
            0.3 * this.canvas.height);
        this.ctx.fillText("Dano: ", 0.15 * this.canvas.width,
            0.65 * this.canvas.height);
        this.ctx.fillText(this.atributos['forca'].valor, 0.15 * this.canvas.width + 50,
            0.65 * this.canvas.height);

        // Barra de cooldown
        let x = 0.075 * this.canvas.width;
        let y = 0.7 * this.canvas.height;
        const w = 0.25 * this.canvas.width;
        const h = 0.01 * this.canvas.height;
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



    upgrade(nomeAtributo) {
        const atributo = this.atributos[nomeAtributo];
        if (this.experienciaAtual >= atributo.custoAtual) {
            this.experienciaAtual -= atributo.custoAtual;
            atributo.quantidade++;
            atributo.valor += 1;
            atributo.custoAtual = Math.round(
                atributo.custoInicial * Math.pow(1.15, atributo.quantidade)
            );
            console.log("Novo custo: " + atributo.custoAtual);
        }
        this.cooldown = 0.2 + ((3 - this.atributos['velocidade'].valor) < 0 ? 0 : 3 - this.atributos['velocidade'].valor)
        /*
        if (atributo.currentCost > this.pontosAtuais)
            return;
        this.pontosAtuais = parseFloat(
            (this.pontosAtuais - atributo.currentCost).toFixed(10)
        );
        this.pontosGastos += parseFloat(
            atributo.currentCost.toFixed(10)
        );
        atributo.quantity++;
        this.taxaPonto = parseFloat(
            (this.taxaPonto + atributo.income).toFixed(10)
        );
        this.log.upgrades.push({
            "recursoMelhorado": atributo.label,
            "custo": atributo.currentCost,
        });
        atributo.currentCost = Math.round(
            atributo.initialCost * Math.pow(1.15, atributo.quantity)
        );
        this.game.graph.adicionarDado(parseInt(this.temporizador), this.taxaPonto);
        this.game.graph.atualizarGrafico()
        // this.game.graph.adicionarDado(atributo.currentIncome, atributo.currentCost);
        // this.game.graph.atualizarGrafico();
        return;
        */
    }




}