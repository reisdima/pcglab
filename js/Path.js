export default class Path{
    constructor(linhas = 8, colunas = 12, tamanho = 32, cena = null){
        this.LINHAS = linhas;
        this.COLUNAS = colunas;
        this.SIZE = tamanho;
        this.cena = cena;
        this.tiles = [];
        this.caminho = [];
        this.steps = [];
        for (let l = 0; l < this.LINHAS; l++) {
            this.tiles[l] = [];
            this.steps[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                this.tiles[l][c] = 0;
                this.steps[l][c] = 0;
            }
        }
    }

    desenhar(ctx){
        for (let l = 0; l < this.LINHAS; l++) {
            for (let c = 0; c < this.COLUNAS; c++) {
                ctx.font = "15px Arial";
                ctx.fillStyle = "blue";
                if(this.steps[l][c] === 1){
                    ctx.fillText(" O ", c*this.SIZE + this.SIZE/2, l*this.SIZE + this.SIZE/2 + 10);
                }
                ctx.strokeRect(c*this.SIZE, l*this.SIZE, this.SIZE, this.SIZE); 
            }
        }
    }

    addStep(x,y){
        this.steps[x][y] = 1;
    }

    removeStep(x,y){
        this.steps[x][y] = 0;
    }
}

//module.exports = Path;