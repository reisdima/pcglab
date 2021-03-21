import Cena from "./Cena.js";

export default class CenaTutorial extends Cena{

    desenhar(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.assets.img("background"), 0, 0, 816, 624);
        this.ctx.font = "40px Impact";
        this.ctx.fillStyle = "yellow";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Tutorial", this.canvas.width/2, 100);

        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "left";

        this.ctx.drawImage(this.assets.img("guerreiro"), 0*30, 3*54, 30, 54, 70, 130, 30, 54);
        this.ctx.fillText("Você controla o amigo aqui da armadura dourada. O problema é que ele tá desarmado.", 110, 150);
        this.ctx.fillText("Use as setas p/ cima, baixo, esquerda e direita do teclado para andar.", 110, 170);

        this.ctx.drawImage(this.assets.img("skelly"), 0*32, 3*50, 32, 50, 70, 200, 32, 50);
        this.ctx.fillText("Vai ter uns esqueletos desse andando por aí, não deixa eles te pegarem. Eles são bem", 110, 220);
        this.ctx.fillText("burros, ficam andando sem rumo, então é só ficar ligado que vai dar bom.", 110, 240);

        this.ctx.drawImage(this.assets.img("ghost"), 0*64, 0*64, 64, 64, 70, 280, 32, 32);
        this.ctx.fillText("Esses fantasmas são bem traiçoeiros, eles ficam perseguindo sem parar, se escondem", 110, 280);
        this.ctx.fillText("dentro das paredes e é difícil saber onde eles estão. Pra sua sorte, estão todos presos", 110, 300);
        this.ctx.fillText("por umas rochas que não conseguem atravessar, pode ficar de boas ;)", 110, 320);

        this.ctx.drawImage(this.assets.img("moeda"), 0*32, 0*32, 32, 32, 70, 350, 32, 32);
        this.ctx.fillText("Você deve estar se perguntando qual a vantagem de entrar nessa roubada. Ouro, é claro!", 110, 360);
        this.ctx.fillText("Calculo que deve ter umas 20 moedas de ouro lá dentro, se você souber procurar. Boa sorte!", 110, 380);

        this.ctx.drawImage(this.assets.img("porta"), 0, 0, 32, 48, 70, 410, 32, 48);
        this.ctx.fillText("Quando resolver que já coletou bastante moeda, é só procurar a porta pra ir pro próximo", 110, 430);
        this.ctx.fillText("nível.", 110, 450);

        this.ctx.drawImage(this.assets.img("alavanca"), 0, 0, 32, 32, 70, 490, 32, 32);
        this.ctx.fillText("Talvez você precise usar umas alavancas dessa pra liberar uma passagem ou outra, mas", 110, 500);
        this.ctx.fillText("nada demais :)", 110, 520);

        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "yellow";
        this.ctx.textAlign = "left";
        this.ctx.fillText("Use ' P ' pra pausar e ' I ' pra continuar. Se estiver pronto pro play, aperta espaço.", 110, 550);
    }

    quadro(t){
        this.t0 = this.t0 ?? t;
        this.dt = (t- this.t0)/1000;

        if(this.assets.acabou()){
            if(this.input.comandos.get("PROXIMA_CENA")){
                this.game.moedas = 0;
                this.game.selecionaCena("carregando");
                return;
            }
        }
        this.desenhar();

        this.iniciar();
        this.t0 = t;
    }
}