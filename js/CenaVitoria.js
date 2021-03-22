import Cena from "./Cena.js";

export default class CenaVitoria extends Cena{
    desenhar(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.assets.img("background"), 0, 0, 816, 624);
        this.ctx.font = "40px Impact";
        this.ctx.fillStyle = "yellow";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Vitória", this.canvas.width/2, this.canvas.height/2 - 50);

        for (let i = 0; i < this.game.moedas; i++) {
            this.ctx.drawImage(this.assets.img("moeda"), 0, 0, 32, 32, i*32 + 80, 400, 48, 48);
        }

        this.ctx.font = "30px Impact";
        this.ctx.fillText("Total de moedas: " + this.game.moedas + "/20", this.canvas.width/2, this.canvas.height/2);
        this.ctx.font = "20px Impact";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Continua (?)", this.canvas.width/2, this.canvas.height/2 + 50);
        if(this.game.moedas === 20 && this.game.conquista === "false"){
            this.assets.play("conquista");
            this.game.conquista = "true";
            this.ctx.font = "20px Impact";
            this.ctx.fillStyle = "white";
            this.ctx.textAlign = "left";
            this.ctx.fillText("Conquista desbloqueada! (20/20 moedas)", 60, 80);
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
        this.desenhar();

        this.iniciar();
        this.t0 = t;
    }
}