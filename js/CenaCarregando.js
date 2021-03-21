import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import modeloMapaFase1 from "../maps/mapaFase2.js";

export default class CenaCarregando extends Cena{

    desenhar(){
        this.ctx.fillStyle = "#2f8136";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.assets.img("background"), 0, 0, 816, 624);

        this.ctx.drawImage(this.assets.img("guerreiro"), 0*30, 3*54, 30, 54, 100, 250, 90, 162);
        this.ctx.drawImage(this.assets.img("skelly"), 0*32, 1*50, 32, 50, 625, 250, 96, 150);

        this.ctx.font = "40px Impact";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText("(Insira aqui um nome para o jogo)", this.canvas.width/2, this.canvas.height/2 - 150);

        this.ctx.font = "20px Impact";
        this.ctx.fillStyle = "yellow";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.assets?.progresso(), this.canvas.width/2, this.canvas.height/2 + 40);
        
        if(this.assets.acabou()){
            this.ctx.font = "30px Impact";
            this.ctx.fillText("Aperte espaço para continuar", this.canvas.width/2, this.canvas.height/2 + 80);
            this.ctx.font = "25px Impact";
            this.ctx.fillText("Aperte ' T ' para ver o tutorial", this.canvas.width/2, this.canvas.height/2 + 120);
        }
    }

    quadro(t){
        this.t0 = this.t0 ?? t;
        this.dt = (t- this.t0)/1000;

        if(this.assets.acabou()){
            if(this.input.comandos.get("PROXIMA_CENA")){
                this.game.selecionaCena("fase1");
                return;
            }
            if(this.input.comandos.get("CENA_TUTORIAL")){
                this.game.selecionaCena("tutorial");
                return;
            }
        }
        this.desenhar();

        this.iniciar();
        this.t0 = t;
    }
}