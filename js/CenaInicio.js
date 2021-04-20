import Cena from "./Cena.js";

export default class CenaInicio extends Cena{
    desenhar(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = "20px Times";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Aperte T para caminho mínimo por sprites", this.canvas.width/2, this.canvas.height/2 - 50);
        this.ctx.fillText("Aperte R para caminho mínimo por grid", this.canvas.width/2, this.canvas.height/2);
    }

    quadro(t){
        this.t0 = this.t0 ?? t;
        this.dt = (t- this.t0)/1000;

        // Menu de comandos
        if(this.assets.acabou()){
            if(this.input.comandos.get("CENA_CAMINHO_SPRITE")){
                this.game.selecionaCena("fase1");
                return;
            }
            if(this.input.comandos.get("CENA_CAMINHO_GRID")){
                this.game.selecionaCena("fase2");
                return;
            }
        }
        this.desenhar();

        this.iniciar();
        this.t0 = t;
    }
}