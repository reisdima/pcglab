import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";
import modeloMapaFase1 from "../maps/mapaFase2.js";

export default class CenaFase2 extends Cena{
    quandoColidir(a, b){
        //Colisão básica (elimina os dois)
        if(a.tags.has("pc") && b.tags.has("enemy")){ // Se pc colidir com inimigo, remove os dois, emite som e Game Over
            if(!this.aRemover.includes(a)){
                this.aRemover.push(a);
            }
            if(!this.aRemover.includes(b)){
                this.aRemover.push(b);
            }
            this.assets.play("bruh");
            this.game.selecionaCena("fim");
        }
        if(a.tags.has("pc") && b.tags.has("exit")){ // Se pc colidir com saída, remove os dois e vai pra próx. fase
            if(!this.aRemover.includes(a)){
                this.aRemover.push(a);
            }
            if(!this.aRemover.includes(b)){
                this.aRemover.push(b);
            }
            this.game.selecionaCena("win");
        }
        if(a.tags.has("enemy") && b.tags.has("exit")){ // Se pc colidir com saída, não faz nada (por enquanto)
        }

        //console.log(this.aRemover);
    }

    preparar(){
        super.preparar();
        const mapa1 = new Mapa(10, 14, 32);
        mapa1.carregaMapa(modeloMapaFase1);
        this.configuraMapa(mapa1);

        const pc = new Sprite({x:50, y :150, h: 20, w:20});
        pc.tags.add("pc");

        const cena = this;

        pc.controlar = function(dt){
            if(cena.input.comandos.get("MOVE_ESQUERDA")){
                this.vx = -150;
            } else if (cena.input.comandos.get("MOVE_DIREITA")){
                this.vx = +150;
            } else {
                this.vx = 0;
            }
            if(cena.input.comandos.get("MOVE_CIMA")){
                this.vy = -150;
            } else if (cena.input.comandos.get("MOVE_BAIXO")){
                this.vy = +150;
            } else {
                this.vy = 0;
            }
        };
        this.adicionar(pc);

        function perseguePC(dt){
            this.vx = 25*Math.sign(pc.x - this.x);
            this.vy = 25*Math.sign(pc.y - this.y);
        }

        const en1 = new Sprite({x:360, y: 250, color:"darkblue", h: 20, w:20, controlar: perseguePC, tags:["enemy"]});

        this.adicionar(en1);
        //this.adicionar(new Sprite({x: 115, y:70, vy:10, color:"red", h: 20, w:20, controlar: perseguePC, tags:["enemy"]}));
        //this.adicionar(new Sprite({x: 115, y:160, vy:-10, color:"red", h: 20, w:20, controlar: perseguePC, tags:["enemy"]}));

        const exit = new Sprite({x: 16*32 - 64, y: 12*32/2, w: 32, h: 32, color: "yellow", tags:["exit"]});
        this.adicionar(exit);
        
    }

    desenharHud(){
        // Fase
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText("Fase 2", 30, 20);

        // Moedas
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText("Moedas: " + this.game.moedas, this.canvas.width - 60, 20);
    }
}