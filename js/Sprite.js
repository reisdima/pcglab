export default class Sprite{
    // É responsável por modelar algo que se move na tela.
    constructor({x=100, y=100, w=10, h=10, color="white", vx=0, vy=0, vida=0, controlar = ()=>{}}={}){
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
        this.controlar = controlar;
    }

    desenhar(ctx){ 
        const SIZE = this.cena.mapa.SIZE;

        if(this.cena.mapa.tiles[this.my][this.mx] != 1){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
            ctx.strokeStyle = "blue";
            //ctx.strokeRect(this.mx * SIZE, this.my * SIZE, SIZE, SIZE);
        }
        else{
            this.x = this.randValue(43, ctx.canvas.width - 43);
            this.y = this.randValue(43, ctx.canvas.height - 43);
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
            ctx.strokeStyle = "blue";
            //ctx.strokeRect(this.mx * SIZE, this.my * SIZE, SIZE, SIZE);
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
            if(this.cena.mapa.tiles[pmy][pmx] != 0){
                const tile = {x: pmx*SIZE + SIZE/2, y: pmy*SIZE + SIZE/2, w: SIZE, h:SIZE};
                this.cena.ctx.strokeStyle = "white";
                //this.cena.ctx.strokeRect(tile.x - SIZE/2, tile.y - SIZE/2, SIZE, SIZE);
                if(this.colidiuCom(tile)){
                    this.vx = this.vx * -1;
                    this.x = tile.x - tile.w/2 - this.w/2 - 1;
                }
            }
        }
    }

    aplicaRestricoesEsquerda(pmx, pmy){
        if(this.vx < 0){ 
            const SIZE = this.cena.mapa.SIZE;
            if(this.cena.mapa.tiles[pmy][pmx] != 0){
                const tile = {x: pmx*SIZE + SIZE/2, y: pmy*SIZE + SIZE/2, w: SIZE, h:SIZE};
                this.cena.ctx.strokeStyle = "white";
                //this.cena.ctx.strokeRect(tile.x - SIZE/2, tile.y - SIZE/2, SIZE, SIZE);
                if(this.colidiuCom(tile)){
                    this.vx = this.vx * -1;
                    this.x = tile.x + tile.w/2 + this.w/2 + 1;
                }
            }
        }
    }

    aplicaRestricoesBaixo(pmx, pmy){
        if(this.vy > 0){ 
            const SIZE = this.cena.mapa.SIZE;
            if(this.cena.mapa.tiles[pmy][pmx] != 0){
                const tile = {x: pmx*SIZE + SIZE/2, y: pmy*SIZE + SIZE/2, w: SIZE, h:SIZE};
                this.cena.ctx.strokeStyle = "white";
                //this.cena.ctx.strokeRect(tile.x - SIZE/2, tile.y - SIZE/2, SIZE, SIZE);
                if(this.colidiuCom(tile)){
                    this.vy = this.vy * -1;
                    this.y = tile.y - tile.h/2 - this.h/2 - 1;
                }
            }
        }
    }

    aplicaRestricoesCima(pmx, pmy){
        if(this.vy < 0){ 
            const SIZE = this.cena.mapa.SIZE;
            if(this.cena.mapa.tiles[pmy][pmx] != 0){
                const tile = {x: pmx*SIZE + SIZE/2, y: pmy*SIZE + SIZE/2, w: SIZE, h:SIZE};
                this.cena.ctx.strokeStyle = "white";
                //this.cena.ctx.strokeRect(tile.x - SIZE/2, tile.y - SIZE/2, SIZE, SIZE);
                if(this.colidiuCom(tile)){
                    this.vy = this.vy * -1;
                    this.y = tile.y + tile.h/2 + this.h/2 + 1;
                }
            }
        }
    }

    randValue(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}