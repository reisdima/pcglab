import Cena from "./Cena.js";

export default class CenaFim extends Cena{
    desenhar(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "40px Impact";
        this.ctx.fillStyle = "red";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Game Over", this.canvas.width/2, this.canvas.height/2 - 50);

        this.ctx.font = "20px Impact";
        this.ctx.fillText("Total de moedas: " + this.game.moedas, this.canvas.width/2, this.canvas.height/2);
        
        if(this.assets.acabou()){
            this.ctx.fillStyle = "white";
            this.ctx.fillText("Aperte espaço para começar de novo ou ' T ' para ir pro tutorial", this.canvas.width/2, this.canvas.height/2 + 50);
        }
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
        if(this.input.comandos.get("CENA_TUTORIAL")){
            this.game.selecionaCena("tutorial");
            return;
        }
        this.desenhar();

        this.iniciar();
        this.t0 = t;
    }
}