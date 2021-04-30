export default class Path{
    constructor(linhas = 8, colunas = 12, tamanho = 32, layer = null){
        this.LINHAS = linhas;
        this.COLUNAS = colunas;
        this.SIZE = tamanho;
        this.tiles = [];
        for (let l = 0; l < this.LINHAS; l++) {
            this.tiles[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                this.tiles[l][c] = 0;
            }
        }
        this.layer = layer;
    }

    desenhar(ctx){
        for (let l = 0; l < this.LINHAS; l++) {
            for (let c = 0; c < this.COLUNAS; c++) {
                ctx.font = "15px Arial";
                ctx.fillStyle = "white";
                ctx.fillText(this.tiles[l][c], c*this.SIZE + this.SIZE/2, l*this.SIZE + this.SIZE/2 + 10);
                ctx.strokeRect(c*this.SIZE, l*this.SIZE, this.SIZE, this.SIZE); 
            }
        }
    }

    iniciaLayers(){
        for (let l = 0; l < this.LINHAS; l++) {
            this.tiles[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                this.tiles[l][c] = this.layer.direcoes[l][c];
            }
        }
    }
}
