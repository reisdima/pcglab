import Sprite from "../Sprite.js";
import seedGen from "../SeedGen.js";
import assetsMng from "../AssetsMng.js";
import { setDebugMode, getDebugMode } from "../DebugMode.js";

export default class Character extends Sprite {
    constructor() {
        super({ s: 22, w: 22, h: 10, nomeImagem: "slime", sizeImagem: 22 });
        this.alvo = null;
        this.atributos = {

        }
        this.roomNumber = -1;
        this.hpMax = 200;
        this.hpAtual = 200;
        this.animation = [];
        this.hitpoint = 40;
        this.qtdAnimacoes = { types: 2, lines: [1, 0], qtd: [3, 9] /* atacking: 9, normal: 3*/ };
        this.speedAnimation = 11.49; //1.2;
        this.type = 0;
        this.pose = 0;
        this.raioAtaque = 5;
        this.matrizImagem = {
            linha: 1,
            colunas: 9,
            widthImagem: 22,
            heightImagem: 22
        };
        this.imune = false;
        //this.status = 0;                        // 0 => Normal, 1 => Ataque
        this.atributos = {
            hpMax: 200,
            hpAtual: 200,
            ataque: 40,
            velocidade: 0,
            raioAtaque: 5,
            cooldownAtaque: 0,                  //Tempo travado até terminar o ataque
            cooldownImune: 0
        }
        this.criarAnimacoes();
    }


    movimento(dt) {
        this.pose = this.pose + this.speedAnimation * dt;
        this.controleInvencibilidade();
        this.mover(dt);
        if (this.type === 1) {
            this.atributos.cooldownAtaque = this.atributos.cooldownAtaque - 2 * dt;
        }
    }

    controleInvencibilidade(dt) {
        this.atributos.cooldownImune = this.atributos.cooldownImune - dt;
        if (this.atributos.cooldownImune < 0) {
            this.imune = false;
        }
        else {
            //this.atributos.cooldownAtaque = 0;
            //this.type = 0;
        }
    }

    ativarInvencibilidade() {
        this.atributos.cooldownImune = 1.2;
        this.imune = true;
    }

    criarAnimacoes() {
        // Cria a lista de tipos de animações
        for (let i = 0; i < this.qtdAnimacoes.types; i++) {
            let auxAnimation = {
                animationFrame: [],
                type: i,
                qtdFrames: this.qtdAnimacoes.qtd[i]
            }
            this.animation.push(auxAnimation);
        }

        for (let i = 0; i < this.animation.length; i++) {             // Animações
            for (let j = 0; j < this.animation[i].qtdFrames; j++) {   // Frames
                let animationFrame = {
                    sizeImagem: this.s,
                    pose: j,
                    sx: 1 + 23 * j,
                    sy: 1 + 23 * this.qtdAnimacoes.lines[i],
                };
                this.animation[i].animationFrame.push(animationFrame);
            }
        }

        this.pose = seedGen.nextRandInt(0, 50);             // Sorteia uma posição inicial para que os 
        // inimigos não fiquem sincronizados
    }

    desenhar(ctx) {
        let elipse = {
            x: 0,
            y: 0,
            radiusX: this.sizeImagem / 2 - 0.8,
            radiusY: this.sizeImagem / 3 - 2.2,
            rotation: 0,
            startAngle: 0,
            endAngle: 2 * Math.PI,
            anticlockwise: false
        }
        ctx.linewidth = 1;
        ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
        ctx.strokeStyle = "rgba(10, 10, 10, 0.4)";
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.ellipse(elipse.x, elipse.y, elipse.radiusX, elipse.radiusY, elipse.rotation, elipse.startAngle,
            elipse.endAngle, elipse.anticlockwise);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        if (this.atributos.cooldownImune > 0) {
            ctx.globalAlpha = 0.4;
            this.imune = true;
        }
        else {
            this.imune = false;
        }
        assetsMng.drawClip({
            ctx: ctx, key: this.nomeImagem,
            sx: this.animation[this.type].animationFrame[Math.floor(this.pose) % this.animation[this.type].qtdFrames].sx,
            sy: this.animation[this.type].animationFrame[Math.floor(this.pose) % this.animation[this.type].qtdFrames].sy,
            w: this.matrizImagem.widthImagem, h: 22, dx: -this.matrizImagem.widthImagem / 2,
            dy: -this.matrizImagem.heightImagem / 2 - 8/*- this.matrizImagem.heightImagem/2*/
        });
        ctx.restore();
        this.desenharHP(ctx);
        this.desenharNivel(ctx);
        if (getDebugMode() == 3) {
            this.desenharCentro(ctx);
        }
        else if (getDebugMode() == 4) {
            this.desenharCaixaColisao(ctx);
            this.desenharCentro(ctx);
        }
    }

    desenharHP(ctx) {
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.fillRect(this.x - this.w / 2, this.y - this.h * 2.5, this.w, 4);         // Fundo
        ctx.fillStyle = `hsl(${120 * this.hpAtual / this.atributos.hpMax}, 100%, 50%)`;
        ctx.fillRect(this.x - this.w / 2, this.y - this.h * 2.5, this.w * (Math.max(0, this.hpAtual) / this.atributos.hpMax), 4);         // Quantidade de HP
        ctx.strokeRect(this.x - this.w / 2, this.y - this.h * 2.5, this.w, 4);       // Borda
    }

    desenharNivel(ctx) {
        if (this.nivel) {
            ctx.fillStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.textAlign = 'center';
            ctx.strokeStyle = "black";
            ctx.font = "10px Arial Black";
            ctx.strokeText(this.nivel, this.x, this.y - this.h * 2.7);
            ctx.fillText(this.nivel, this.x, this.y - this.h * 2.7);
        }

    }



    persegue(alvo) {
        if (this.alvo === null) {
            const dx = Math.floor(alvo.x) - Math.floor(this.x);
            const dy = Math.floor(alvo.y) - Math.floor(this.y);
            const d = Math.sqrt(dx * dx + dy * dy);
            if (Math.abs(d) < this.atributos.raioAtaque * (this.map.s / 2)) {       //(k * 16) ==> 16 tamanho do celula
                this.alvo = alvo;
                this.persegue();
                return;
            }

        } else {
            const dx = Math.floor(this.alvo.x) - Math.floor(this.x);
            const dy = Math.floor(this.alvo.y) - Math.floor(this.y);
            this.vx = 20 * Math.sign(dx);
            this.vy = 20 * Math.sign(dy);
        }
    }

    attackPlayer(player) {
        if (this.colidiuComCentralWidthHeight(player) && this.type === 0) {    // Detecta o player e não ta atacando
            this.type = 1;
            this.atributos.cooldownAtaque = 1;
        }
        if (this.atributos.cooldownAtaque < 0 && this.type === 1) {
            this.type = 0;
            if (this.colidiuComCentralWidthHeight(player)) {
                if (player.hp > 0) {
                    player.hp = player.hp - this.atributos.ataque;
                    player.ativarInvencibilidade();
                }
                else {
                    player.hp = 0;
                }
            }
        }
    }

    sofrerAtaque(dano) {
        console.log("Sofrer ataque Character");
        this.hpAtual -= dano;
        if (this.hpAtual <= 0) {
            this.morrer();
        }
    }

    morrer() {
        console.log('Morrer do Character');
    }
}