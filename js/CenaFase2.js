import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";
import modeloMapaFase1 from "../maps/mapaFase2.js";

export default class CenaFase2 extends Cena{
    quandoColidir(a, b){
        if(a.tags.has("pc") && (b.tags.has("esqueleto") || b.tags.has("ghost"))){ // Se pc colidir com inimigo, remove os dois, emite som e Game Over
            if(!this.aRemover.includes(a)){
                this.aRemover.push(a);
            }
            if(!this.aRemover.includes(b)){
                this.aRemover.push(b);
            }
            this.assets.play("hurt");
            this.game.selecionaCena("fim");
        }
        if(a.tags.has("pc") && b.tags.has("exit")){ // Se pc colidir com saída, remove os dois e vai pra próx. fase
            if(!this.aRemover.includes(a)){
                this.aRemover.push(a);
            }
            if(!this.aRemover.includes(b)){
                this.aRemover.push(b);
            }
            this.assets.play("porta");
            this.game.selecionaCena("win");
        }
        if(a.tags.has("pc") && b.tags.has("coin")){ // Se pc colidir com moeda, remove moeda e incrementa contador
            if(!this.aRemover.includes(b)){
                //this.mapa.tiles[0][0] = 0
                this.assets.play("moeda2");
                this.aRemover.push(b);
            }
            this.game.moedas += 1;
        }
        if(a.tags.has("pc") && b.tags.has("alavanca")){ // Se pc colidir com alavanca
            if(!b.tags.has("ativa")){
                this.assets.play("click");
                if(b.tags.has("a1")){
                    b.tags.add("ativa");
                    this.mapa.tiles[6][10] = 0;
                    this.mapa.tiles[6][14] = 0;
                    this.mapa.tiles[4][12] = 0;
                    this.mapa.tiles[8][12] = 0;

                    this.mapa.tiles[4][11] = 1;
                    this.mapa.tiles[4][13] = 1;
                    this.mapa.tiles[8][11] = 1;
                    this.mapa.tiles[8][13] = 1;
                    this.mapa.tiles[5][10] = 1;
                    this.mapa.tiles[5][14] = 1;
                    this.mapa.tiles[7][10] = 1;
                    this.mapa.tiles[7][14] = 1;
                }
            }
        }
        if(a.tags.has("esqueleto") && b.tags.has("ghost")){ // Se esqueleto colidir com fantasma, esqueleto morre
            if(!this.aRemover.includes(a)){
                this.assets.play("ossos");
                this.aRemover.push(a);
                this.adicionar(new Sprite({x: b.x - b.w/2, y: b.y - b.h/2, w: 16, h: 16, tags:["coin"]}));
            }
        }
        if(a.tags.has("ghost") && b.tags.has("ghost")){ // Se fantasma colidir com fantasma, ambos morrem
            if(!this.aRemover.includes(a)){
                this.aRemover.push(a);    
            }
            if(!this.aRemover.includes(b)){
                this.aRemover.push(b);
            }
            this.assets.play("bruh");
            this.adicionar(new Sprite({x: b.x - b.w/2 + 10, y: b.y - b.h/2, w: 16, h: 16, tags:["coin"]}));
            this.adicionar(new Sprite({x: b.x - b.w/2 - 10, y: b.y - b.h/2, w: 16, h: 16, tags:["coin"]}));
            this.adicionar(new Sprite({x: b.x - b.w/2, y: b.y - b.h/2 + 10,  w: 16, h: 16, tags:["coin"]}));
            this.adicionar(new Sprite({x: b.x - b.w/2, y: b.y - b.h/2 - 10, w: 16, h: 16, tags:["coin"]}));
        }

        //console.log(this.aRemover);
    }

    preparar(){
        super.preparar();
        const mapa1 = new Mapa(10, 14, 48);
        mapa1.carregaMapa(modeloMapaFase1);
        this.configuraMapa(mapa1);

        // Desenha o pc
        const pc = new Sprite({x: 72, y :13*48/2, w:18, h: 42});
        pc.tags.add("pc");

        const cena = this;

        // Define controle do pc
        pc.controlar = function(dt){
            if(cena.input.comandos.get("MOVE_ESQUERDA")){
                this.direcao = "esq";
                this.parado = "false";
                this.vx = -150;
            } else if (cena.input.comandos.get("MOVE_DIREITA")){
                this.direcao = "dir";
                this.parado = "false";
                this.vx = +150;
            } else {
                this.vx = 0;
            }
            if(cena.input.comandos.get("MOVE_CIMA")){
                this.direcao = "cima";
                this.parado = "false";
                this.vy = -150;
            } else if (cena.input.comandos.get("MOVE_BAIXO")){
                this.direcao = "baixo";
                this.parado = "false";
                this.vy = +150;
            } else {
                this.vy = 0;
            }
        };
        this.adicionar(pc);

        
        // Cria inimigos
        const en1 = new Sprite({x:360, y: 250, w: 28, h: 46, color:"darkblue", controlar: perseguePC, tags:["esqueleto"]});
        //this.adicionar(en1);
        //this.adicionar(new Sprite({x: 115, y:70, vy:10, color:"red", h: 20, w:20, controlar: perseguePC, tags:["esqueleto"]}));
        //this.adicionar(new Sprite({x: 115, y:160, vy:-10, color:"red", h: 20, w:20, controlar: perseguePC, tags:["esqueleto"]}));

        // Cria alavancas
        this.adicionar(new Sprite({x: 265, y:13*48/2, w: 32, h: 32, tags:["alavanca","a1"]}));

        // Cria fantasma
        this.adicionar(new Sprite({x: 48, y: 48, w: 32, h: 32, controlar: perseguePC, tags:["ghost"], direcao: "esq"}));
        this.adicionar(new Sprite({x: 598, y: 310, w: 32, h: 32, controlar: perseguePC, tags:["ghost"], direcao: "esq"}));
        
        // Cria saída
        const exit = new Sprite({x: 17*48 - 64, y: 13*48/2, w: 32, h: 48, tags:["exit"]});
        this.adicionar(exit);
        
        // Cria moedas
        this.adicionar(new Sprite({x: 17*48 - 72, y: 216, w: 16, h: 16, tags:["coin"]}));
        this.adicionar(new Sprite({x: 17*48 - 72, y: 408, w: 16, h: 16, tags:["coin"]}));
        
        // Função de perseguição
        function perseguePC(dt){
            this.vx = 25*Math.sign(pc.x - this.x);
            this.vy = 25*Math.sign(pc.y - this.y);
            if(pc.x > this.x){
                this.direcao = "dir";
            }
            if(pc.x < this.x){
                this.direcao = "esq";
            }
            /*if (pc.y < this.y){
                this.direcao = "cima";
            }
            if (pc.y > this.y){
                this.direcao = "baixo";
            }*/
        }
        
        // Função de movimentação básica
        function movimentoBasico(dt){
            if(this.direcao === "dir"){
                this.vx = 60;
            }
            if(this.direcao === "esq"){
                this.vx = -60;
            }
            if(this.direcao === "cima"){
                this.vy = -60;
            }
            if(this.direcao === "baixo"){
                this.vy = 60;
            }
            
            //console.log(this.direcao);
        }

    }

    desenharHud(){
        // Fase
        this.ctx.fillStyle = "yellow";
        this.ctx.font = "20px Impact";
        this.ctx.fillText("Fase 2", 30, 30);

        // Moedas
        this.ctx.drawImage(this.assets.img("moeda"), 0, 0, 32, 32, this.canvas.width - 62, 12, 20, 20);
        this.ctx.font = "20px Impact";
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText(": " + this.game.moedas, this.canvas.width - 30, 30);

        // Escudo
        switch (this.game.playerShield) {
            case 0:
                this.ctx.drawImage(this.assets.img("escudo"), 0, 0, 32, 32, this.canvas.width - 130, 12, 20, 20);
                break;
            case 1:
                this.ctx.drawImage(this.assets.img("escudo"), 32, 0, 32, 32, this.canvas.width - 130, 12, 20, 20);
                break;
            case 2:
                this.ctx.drawImage(this.assets.img("escudo"), 64, 0, 32, 32, this.canvas.width - 130, 12, 20, 20);
                break;
            case 3:
                this.ctx.drawImage(this.assets.img("escudo"), 96, 0, 32, 32, this.canvas.width - 130, 12, 20, 20);
                break;
            case 4:
                this.ctx.drawImage(this.assets.img("escudo"), 128, 0, 32, 32, this.canvas.width - 130, 12, 20, 20);
                this.ctx.font = "20px Impact";
                this.ctx.fillStyle = "yellow";
                this.ctx.fillText(": ", this.canvas.width - 125, 30);
                break;
        }
    }
}