export default class Sprite{
    // É responsável por modelar algo que se move na tela.
    constructor({x=20, y=20, w=45, h=45, color="white", vx=0, vy=0, vida=0, direcao="dir",controlar = ()=>{}, tags = []}={}){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.w = w;
        this.h = h;
        this.color = color;
        this.cena = null;
        this.mx = 0;
        this.my = 0;
        this.vida = vida;
        this.direcao = direcao;
        this.hitbox = "false";
        this.controlar = controlar;
        this.tags = new Set();
        tags.forEach((tag)=>{
            this.tags.add(tag);
        });
        this.pose = 0;
        this.quadro = 0;
        this.POSES_PERSONAGENS = [ // qmax: numero de poses em cada quadro // pv: velocidade da pose
            {qmax: 7, pv: 9}, // Quadro (linha) 0 -----> Andar p/ cima
            {qmax: 7, pv: 9}, // Quadro (linha) 1 -----> Andar p/ esquerda
            {qmax: 7, pv: 9}, // Quadro (linha) 2 -----> Andar p/ baixo
            {qmax: 7, pv: 9}, // Quadro (linha) 3 -----> Andar p/ direita
            {qmax: 8, pv: 9}, // Quadro (linha) 4
            {qmax: 8, pv: 9}, // Quadro (linha) 5
            {qmax: 8, pv: 9}, // Quadro (linha) 6
            {qmax: 8, pv: 9}, // Quadro (linha) 7
            {qmax: 9, pv: 12}, // Quadro (linha) 8 -----> Andar p/ cima
            {qmax: 9, pv: 12}, // Quadro (linha) 9 -----> Andar p/ esquerda
            {qmax: 9, pv: 12}, // Quadro (linha) 10 ----> Andar p/ baixo
            {qmax: 9, pv: 12}  // Quadro (linha) 11 ----> Andar p/ direita
        ];
        this.POSES_MOEDA = [
            {qmax: 6, pv: 9}
        ];
        this.distancias = [];
    }

    desenhar(ctx){ 
        const SIZE = this.cena.mapa.SIZE;

        if(this.cena.mapa.tiles[this.my][this.mx] === 0){
            // Desenho e movimentos moeda
            if(this.tags.has("coin")) {
                this.quadro = (this.quadro >= this.POSES_MOEDA[0].qmax - 1) ? 0 : this.quadro + this.POSES_MOEDA[0].pv*this.cena.dt;
                ctx.drawImage(this.cena.assets.img("moeda"), Math.floor(this.quadro)*32, 0, 32, 32, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                if(this.hitbox === "true"){
                    ctx.strokeStyle = "blue";
                    ctx.strokeRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                } 

            // Desenho e movimentos básicos
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                if(this.hitbox === "true"){
                    ctx.strokeStyle = "blue";
                    ctx.strokeRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                } 
            }

            // Modelo de desenho:
              // sx, sy, sw, sh, dx, dy, dw, dh
              // sx: x de origem; sy: y de origem; sw: w de origem; sh: h de origem 
              // dx: x de destino; dy: y de destino; dw: w de destino; dh: h de origem;
            
            // Mostrar tile box
            /*
            ctx.strokeStyle = "blue";
            ctx.strokeRect(this.mx * SIZE, this.my * SIZE, SIZE, SIZE);
            */
        
        } else  {
            if(this.tags.has("coin") || (this.tags.has("escudo"))){
                this.x = this.randValue(43, ctx.canvas.width - 43);
                this.y = this.randValue(43, ctx.canvas.height - 43);
            }
        }
    }
    
    controlar(dt){
        
    }

    mover(dt){
        this.x = this.x + this.vx*dt;
        this.y = this.y + this.vy*dt;
        this.my = Math.floor(this.y / this.cena.mapa.SIZE);
        this.mx = Math.floor(this.x / this.cena.mapa.SIZE);
    }

    passo(dt){
        this.controlar(dt);
        this.mover(dt);
    }

    colidiuCom(outro){
        return !(
            (this.x - this.w/2 > outro.x + outro.w/2) ||
            (this.x + this.w/2 < outro.x - outro.w/2) ||
            (this.y - this.h/2 > outro.y + outro.h/2) ||
            (this.y + this.h/2 < outro.y - outro.h/2)
        );
    }

    aplicaRestricoes(dt){
        this.aplicaRestricoesDireita(this.mx + 1, this.my - 1);
        this.aplicaRestricoesDireita(this.mx + 1, this.my);
        this.aplicaRestricoesDireita(this.mx + 1, this.my + 1);

        this.aplicaRestricoesEsquerda(this.mx - 1, this.my - 1);
        this.aplicaRestricoesEsquerda(this.mx - 1, this.my);
        this.aplicaRestricoesEsquerda(this.mx - 1, this.my + 1);

        this.aplicaRestricoesBaixo(this.mx - 1, this.my + 1);
        this.aplicaRestricoesBaixo(this.mx, this.my + 1);
        this.aplicaRestricoesBaixo(this.mx + 1, this.my + 1);

        this.aplicaRestricoesCima(this.mx - 1, this.my - 1);
        this.aplicaRestricoesCima(this.mx, this.my - 1);
        this.aplicaRestricoesCima(this.mx + 1, this.my - 1);
    }

    aplicaRestricoesDireita(pmx, pmy){
        if(this.vx > 0){ 
            const SIZE = this.cena.mapa.SIZE;
            const tile = {x: pmx*SIZE + SIZE/2, y: pmy*SIZE + SIZE/2, w: SIZE, h:SIZE};
            this.cena.ctx.strokeStyle = "white";
            //this.cena.ctx.strokeRect(tile.x - SIZE/2, tile.y - SIZE/2, SIZE, SIZE);
            switch (this.cena.mapa.tiles[pmy][pmx]) {
                case 1:
                    if(this.colidiuCom(tile)){
                        if(!this.tags.has("ghost")){
                            this.x = tile.x - tile.w/2 - this.w/2 - 1;
                            if(this.tags.has("movBasic")){
                            this.direcao = "esq";
                            }
                        }
                    }
                    break;
                case 2:
                    if(this.colidiuCom(tile)){
                        this.x = tile.x - tile.w/2 - this.w/2 - 1;
                        if(this.tags.has("movBasic")){
                            this.direcao = "esq";
                        }
                    }
                default:
                    break;
            }
        }
    }

    aplicaRestricoesEsquerda(pmx, pmy){
        if(this.vx < 0){ 
            const SIZE = this.cena.mapa.SIZE;
            const tile = {x: pmx*SIZE + SIZE/2, y: pmy*SIZE + SIZE/2, w: SIZE, h:SIZE};
            this.cena.ctx.strokeStyle = "white";
            //this.cena.ctx.strokeRect(tile.x - SIZE/2, tile.y - SIZE/2, SIZE, SIZE);
            switch (this.cena.mapa.tiles[pmy][pmx]) {
                case 1:
                    if(this.colidiuCom(tile)){
                        if(!this.tags.has("ghost")){
                            this.x = tile.x + tile.w/2 + this.w/2 + 1;
                            if(this.tags.has("movBasic")){
                                this.direcao = "dir";
                            }
                        }
                    }
                    break;
                case 2:
                    if(this.colidiuCom(tile)){
                        this.x = tile.x + tile.w/2 + this.w/2 + 1;
                        if(this.tags.has("movBasic")){
                            this.direcao = "dir";
                        }
                    }
                default:
                    break;
            }
        }
    }

    aplicaRestricoesBaixo(pmx, pmy){
        if(this.vy > 0){ 
            const SIZE = this.cena.mapa.SIZE;
            const tile = {x: pmx*SIZE + SIZE/2, y: pmy*SIZE + SIZE/2, w: SIZE, h:SIZE};
            this.cena.ctx.strokeStyle = "white";
            //this.cena.ctx.strokeRect(tile.x - SIZE/2, tile.y - SIZE/2, SIZE, SIZE);
            switch (this.cena.mapa.tiles[pmy][pmx]) {
                case 1:
                    if(this.colidiuCom(tile)){
                        if(!this.tags.has("ghost")){
                            this.y = tile.y - tile.h/2 - this.h/2 - 1;
                            if(this.tags.has("movBasic")){
                                this.direcao = "cima";
                            }
                        }
                    }
                    break;
                case 2:
                    if(this.colidiuCom(tile)){
                        this.y = tile.y - tile.h/2 - this.h/2 - 1;
                        if(this.tags.has("movBasic")){
                            this.direcao = "cima";
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }

    aplicaRestricoesCima(pmx, pmy){
        if(this.vy < 0){ 
            const SIZE = this.cena.mapa.SIZE;
            const tile = {x: pmx*SIZE + SIZE/2, y: pmy*SIZE + SIZE/2, w: SIZE, h:SIZE};
            this.cena.ctx.strokeStyle = "white";
            //this.cena.ctx.strokeRect(tile.x - SIZE/2, tile.y - SIZE/2, SIZE, SIZE);
            switch (this.cena.mapa.tiles[pmy][pmx]) {
                case 1:
                    if(this.colidiuCom(tile)){
                        if(!this.tags.has("ghost")){
                            this.y = tile.y + tile.h/2 + this.h/2 + 1;
                            if(this.tags.has("movBasic")){
                                this.direcao = "baixo";
                            }
                        }
                    }
                    break;
                case 2:
                    if(this.colidiuCom(tile)){
                        this.y = tile.y + tile.h/2 + this.h/2 + 1;
                        if(this.tags.has("movBasic")){
                            this.direcao = "baixo";
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }

    randValue(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    
}