import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";
import modeloMapaFase1 from "../maps/mapaFase1.js";

export default class CenaFase1 extends Cena{
    quandoColidir(a, b){
        if(a.tags.has("pc") && (b.tags.has("esqueleto") || b.tags.has("ghost"))){ // Se pc colidir com inimigo, remove os dois, emite som e Game Over
            if(this.game.playerShield != 4){ // Foi atingido sem escudo, morre
                if(!this.aRemover.includes(a)){
                    this.aRemover.push(a);
                }
                if(!this.aRemover.includes(b)){
                    this.aRemover.push(b);
                }
                this.game.playerShield = 0;
                this.assets.play("hurt");
                this.game.selecionaCena("fim");
            }
            else if(this.game.playerShield === 4 && !b.tags.has("ghost")){ // Foi atingido por esqueleto, com escudo, esqueleto morre e perde escudo
                if(!this.aRemover.includes(b)){
                    this.aRemover.push(b);
                    this.game.playerShield = 0;
                    this.assets.play("ossos");
                    this.adicionar(new Sprite({x: a.x, y: a.y, w: 16, h: 16, tags:["coin"]}));
                    this.assets.play("escudo2");
                }
            }
            else if(this.game.playerShield === 4 && b.tags.has("ghost")){ // Tem escudo, mas foi atingido por fantasma, morre
                if(!this.aRemover.includes(a)){
                    this.aRemover.push(a);
                }
                if(!this.aRemover.includes(b)){
                    this.aRemover.push(b);
                }
                this.game.playerShield = 0;
                this.assets.play("hurt");
                this.game.selecionaCena("fim");
            }
        }
        if(a.tags.has("pc") && b.tags.has("exit")){ // Se pc colidir com saída, remove os dois e vai pra próx. fase
            if(!this.aRemover.includes(a)){
                this.aRemover.push(a);
            }
            if(!this.aRemover.includes(b)){
                this.aRemover.push(b);
            }
            this.assets.play("porta");
            this.game.selecionaCena("fase2");
        }
        if(a.tags.has("pc") && b.tags.has("coin")){ // Se pc colidir com moeda, remove moeda e incrementa contador
            if(!this.aRemover.includes(b)){
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
                    this.mapa.tiles[5][7] = 1;
                    this.mapa.tiles[5][8] = 0;
                    this.mapa.tiles[5][9] = 1;
                    this.mapa.tiles[6][7] = 0;
                    this.mapa.tiles[6][9] = 0;
                    this.mapa.tiles[7][7] = 1;
                    this.mapa.tiles[7][8] = 0;
                    this.mapa.tiles[7][9] = 1;

                }
                if(b.tags.has("a2")){
                    b.tags.add("ativa");
                    this.mapa.tiles[6][14] = 0;
                }
            }
        }
        if(a.tags.has("esqueleto") && b.tags.has("ghost")){ // Se esqueleto colidir com fantasma, esqueleto morre
            if(!this.aRemover.includes(a)){
                this.assets.play("ossos");
                this.aRemover.push(a);
                this.adicionar(new Sprite({x: a.x, y: a.y, w: 16, h: 16, tags:["coin"]}));
            }
        }

        if(a.tags.has("pc") && b.tags.has("escudo")){ // Se pc colidir com escudo
            if(!this.aRemover.includes(b)){
                this.aRemover.push(b);
                if(this.game.playerShield <= 3){
                    this.game.playerShield += 1;
                }
            }
            this.assets.play("escudo1");
        }

        //console.log(this.aRemover);
    }

    preparar(){
        super.preparar();

        // Desenha o mapa
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
                this.vx = -150;
            } else if (cena.input.comandos.get("MOVE_DIREITA")){
                this.direcao = "dir";
                this.vx = +150;
            } else {
                this.vx = 0;
            }
            if(cena.input.comandos.get("MOVE_CIMA")){
                this.direcao = "cima";
                this.vy = -150;
            } else if (cena.input.comandos.get("MOVE_BAIXO")){
                this.direcao = "baixo";
                this.vy = +150;
            } else {
                this.vy = 0;
            }
        };
        
        this.adicionar(pc);

        this.adicionar(new Sprite({x: 263, y:72, w: 24, h: 42, controlar: movimentoBasico, tags:["esqueleto","movBasic"], direcao: "baixo"}));
        this.adicionar(new Sprite({x: 263, y:554, w: 24, h: 42, controlar: movimentoBasico, tags:["esqueleto","movBasic"], direcao: "cima"}));
        this.adicionar(new Sprite({x: 552, y:72, w: 24, h: 42, controlar: movimentoBasico, tags:["esqueleto","movBasic"], direcao: "baixo"}));
        this.adicionar(new Sprite({x: 552, y:554, w: 24, h: 42, controlar: movimentoBasico, tags:["esqueleto","movBasic"], direcao: "cima"}));
        this.adicionar(new Sprite({x: 72, y:168, w: 24, h: 42, controlar: movimentoBasico, tags:["esqueleto","movBasic"], direcao: "dir"}));
        this.adicionar(new Sprite({x: 744, y:168, w: 24, h: 42, controlar: movimentoBasico, tags:["esqueleto","movBasic"], direcao: "esq"}));
        this.adicionar(new Sprite({x: 72, y:456, w: 24, h: 42, controlar: movimentoBasico, tags:["esqueleto","movBasic"], direcao: "dir"}));
        this.adicionar(new Sprite({x: 744, y:456, w: 24, h: 42, controlar: movimentoBasico, tags:["esqueleto","movBasic"], direcao: "esq"}));
        this.adicionar(new Sprite({x: 408, y:72, w: 24, h: 42, controlar: movimentoBasico, tags:["esqueleto","movBasic"], direcao: "dir"}));
        this.adicionar(new Sprite({x: 408, y:554, w: 24, h: 42, controlar: movimentoBasico, tags:["esqueleto","movBasic"], direcao: "esq"}));

        // Cria alavancas
        this.adicionar(new Sprite({x: 646, y:13*48/2, w: 32, h: 32, tags:["alavanca","a1"]}));
        this.adicionar(new Sprite({x: 408, y:13*48/2, w: 32, h: 32, tags:["alavanca","a2"]}));

        // Cria fantasma
        this.adicionar(new Sprite({x: 408, y:13*48/2, w: 32, h: 32, controlar: perseguePC, tags:["ghost"], direcao: "esq"}));

        
        // Cria saída
        const exit = new Sprite({x: 17*48 - 64, y: 13*48/2, w: 32, h: 48, tags:["exit"]});
        this.adicionar(exit);
        
        // Cria moedas
        this.adicionar(new Sprite({x: 17*48 - 72, y: 72, w: 16, h: 16, tags:["coin"]}));
        this.adicionar(new Sprite({x: 72, y: 72, w: 16, h: 16, tags:["coin"]}));
        this.adicionar(new Sprite({x: 17*48 - 72, y: 554, w: 16, h: 16, tags:["coin"]}));
        this.adicionar(new Sprite({x: 72, y: 554, w: 16, h: 16, tags:["coin"]}));

        // Gera escudos
        /*setInterval(() => {
            this.adicionar(new Sprite({x: randValue(72, this.canvas.width - 72), y: randValue(72, this.canvas.height - 72),
                 h: 16, w: 16, tags:["escudo"]}));
                 console.log("a");
        }, 30000);*/

        // Criação de sprites experimental 
                                              
        /* //Adiciona sprites mais fortes ("Protagonistas")
        cena.adicionar(new Sprite({x: randValue(43, 16*32 - 43), y: randValue(43, 12*32 - 43), w:20, h:20,
                                    vy: randValue(-200, 200), vx: randValue(-200,200), color:"yellow", vida: 1000}));
                                    cena.adicionar(new Sprite({x: randValue(43, 16*32 - 43), y: randValue(43, 12*32 - 43), w:20, h:20,
                                    vy: randValue(-200, 200), vx: randValue(-200,200), color:"#BA55D3", vida: 1000}));
        cena.adicionar(new Sprite({x: randValue(43, 16*32 - 43), y: randValue(43, 12*32 - 43), w:20, h:20,
            vy: randValue(-200, 200), vx: randValue(-200,200), color:"white", vida: 1000}));
        cena.adicionar(new Sprite({x: randValue(43, 16*32 - 43), y: randValue(43, 12*32 - 43), w:20, h:20,
                                    vy: randValue(-200, 200), vx: randValue(-200,200), color:"#00FFFF", vida: 1000}));
                                    
                                    // Adiciona sprites "inimigos" a cada 4000 ms (4 segundos)
        setInterval(() => {
            cena.adicionar(new Sprite({x: randValue(43, 16*32 - 43), y: randValue(43, 12*32 - 43),
                vy: randValue(-100, 100), vx: randValue(-100,100), color:"red"}));
            }, 4000);*/
            
        // Função de movimentação por perseguição
        function perseguePC(dt){
            this.vx = 40*Math.sign(pc.x - this.x);
            this.vy = 40*Math.sign(pc.y - this.y);
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

        // Função geradora de valores aleatórios
        function randValue(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
        
        desenharHud(){
        // Fase
        this.ctx.font = "20px Impact";
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText("Fase 1", 30, 30);

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
                break;
        }
    }
}