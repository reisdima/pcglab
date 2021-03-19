export default class Sprite{
    // É responsável por modelar algo que se move na tela.
    constructor({x=100, y=100, w=30, h=30, color="white", vx=0, vy=0, vida=0, direcao="dir", parado="true",controlar = ()=>{}, tags = []}={}){
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
        this.parado = parado;
        this.controlar = controlar;
        this.tags = new Set();
        tags.forEach((tag)=>{
            this.tags.add(tag);
        });
        this.pose = 0;
        this.quadro = 0;
        this.POSES_PERSONAGENS = [ // qmax: numero de poses em cada quadro // pv: velocidade da pose
            {qmax: 7, pv: 9}, // Quadro (linha) 0
            {qmax: 7, pv: 9}, // Quadro (linha) 1
            {qmax: 7, pv: 9}, // Quadro (linha) 2
            {qmax: 7, pv: 9}, // Quadro (linha) 3
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
    }

    desenhar(ctx){ 
        const SIZE = this.cena.mapa.SIZE;

        if(this.cena.mapa.tiles[this.my][this.mx] != 1){
            // Desenho e movimentos de pc
            if(this.tags.has("pc")){
                if(this.direcao === "dir"){
                    this.quadro = (this.quadro >= this.POSES_PERSONAGENS[11].qmax - 1) ? 0 : this.quadro + this.POSES_PERSONAGENS[11].pv*this.cena.dt;
                    if(this.vx === 0 && this.vy === 0){
                        ctx.drawImage(this.cena.assets.img("garota"), 0*64, 11*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    } else {
                        ctx.drawImage(this.cena.assets.img("garota"), Math.floor(this.quadro)*64, 11*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    }
                }
                if(this.direcao == "esq"){
                    this.quadro = (this.quadro >= this.POSES_PERSONAGENS[9].qmax - 1) ? 0 : this.quadro + this.POSES_PERSONAGENS[9].pv*this.cena.dt;
                    if(this.vx === 0 && this.vy === 0){
                        ctx.drawImage(this.cena.assets.img("garota"), 0*64, 9*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    } else {
                        ctx.drawImage(this.cena.assets.img("garota"), Math.floor(this.quadro)*64, 9*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    }
                }
                if(this.direcao == "cima"){
                    this.quadro = (this.quadro >= this.POSES_PERSONAGENS[8].qmax - 1) ? 0 : this.quadro + this.POSES_PERSONAGENS[8].pv*this.cena.dt;
                    if(this.vx === 0 && this.vy === 0){
                        ctx.drawImage(this.cena.assets.img("garota"), 0*64, 8*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    } else {
                        ctx.drawImage(this.cena.assets.img("garota"), Math.floor(this.quadro)*64, 8*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    }
                }
                if(this.direcao == "baixo"){
                    this.quadro = (this.quadro >= this.POSES_PERSONAGENS[10].qmax - 1) ? 0 : this.quadro + this.POSES_PERSONAGENS[10].pv*this.cena.dt;
                    if(this.vx === 0 && this.vy === 0){
                        ctx.drawImage(this.cena.assets.img("garota"), 0*64, 10*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    } else {
                        ctx.drawImage(this.cena.assets.img("garota"), Math.floor(this.quadro)*64, 10*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    }
                }
                ctx.strokeStyle = "blue";
                ctx.strokeRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);

            // Desenho e movimentos de enemy
            } else if (this.tags.has("enemy")){
                if(this.direcao === "dir"){
                    this.quadro = (this.quadro >= this.POSES_PERSONAGENS[11].qmax - 1) ? 0 : this.quadro + this.POSES_PERSONAGENS[11].pv*this.cena.dt;
                    if(this.vx === 0 && this.vy === 0){
                        ctx.drawImage(this.cena.assets.img("esqueleto"), 0*64, 11*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    } else {
                        ctx.drawImage(this.cena.assets.img("esqueleto"), Math.floor(this.quadro)*64, 11*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    }
                }
                if(this.direcao == "esq"){
                    this.quadro = (this.quadro >= this.POSES_PERSONAGENS[9].qmax - 1) ? 0 : this.quadro + this.POSES_PERSONAGENS[9].pv*this.cena.dt;
                    if(this.vx === 0 && this.vy === 0){
                        ctx.drawImage(this.cena.assets.img("esqueleto"), 0*64, 9*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    } else {
                        ctx.drawImage(this.cena.assets.img("esqueleto"), Math.floor(this.quadro)*64, 9*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    }
                }
                if(this.direcao == "cima"){
                    this.quadro = (this.quadro >= this.POSES_PERSONAGENS[8].qmax - 1) ? 0 : this.quadro + this.POSES_PERSONAGENS[8].pv*this.cena.dt;
                    if(this.vx === 0 && this.vy === 0){
                        ctx.drawImage(this.cena.assets.img("esqueleto"), 0*64, 8*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    } else {
                        ctx.drawImage(this.cena.assets.img("esqueleto"), Math.floor(this.quadro)*64, 8*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    }
                }
                if(this.direcao == "baixo"){
                    this.quadro = (this.quadro >= this.POSES_PERSONAGENS[10].qmax - 1) ? 0 : this.quadro + this.POSES_PERSONAGENS[10].pv*this.cena.dt;
                    if(this.vx === 0 && this.vy === 0){
                        ctx.drawImage(this.cena.assets.img("esqueleto"), 0*64, 10*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    } else {
                        ctx.drawImage(this.cena.assets.img("esqueleto"), Math.floor(this.quadro)*64, 10*64, 64, 64, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
                    }
                }
                ctx.strokeStyle = "blue";
                ctx.strokeRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);

            // Desenho e movimentos moeda
            } else if(this.tags.has("coin")) {
                this.quadro = (this.quadro >= this.POSES_MOEDA[0].qmax - 1) ? 0 : this.quadro + this.POSES_MOEDA[0].pv*this.cena.dt;
                ctx.drawImage(this.cena.assets.img("moeda"), Math.floor(this.quadro)*32, 0, 32, 32, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
            
            // Desenho e movimentos básicos
            } else if(this.tags.has("exit")){
                ctx.drawImage(this.cena.assets.img("porta"), this.x - this.w/2, this.y - this.h/2, this.w, this.h);
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
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
        }
        else{
            this.x = this.randValue(43, ctx.canvas.width - 43);
            this.y = this.randValue(43, ctx.canvas.height - 43);
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);

            // Mostrar tile box
            /*
            ctx.strokeStyle = "blue";
            ctx.strokeRect(this.mx * SIZE, this.my * SIZE, SIZE, SIZE);
            */
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