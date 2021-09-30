import Cena, {fontMainMenu, wordsColor, alignMainMenu} from './Cena.js';
let stateMainMenu = 0;
export default class CenaMenu extends Cena{

    desenhar(){
        this.limparTela();
        this.ctx.fillStyle = wordsColor;
        this.ctx.textAlign = alignMainMenu;
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "black";
        this.ctx.font = "40px Arial Black";
        this.ctx.strokeText("Maze Runner", this.canvas.width/2, this.canvas.height/3 - 50);
        this.ctx.fillText("Maze Runner", this.canvas.width/2, this.canvas.height/3 - 50);
        this.ctx.font = "15px Arial Black";
        this.ctx.font = fontMainMenu;
        
        this.ctx.fillStyle = wordsColor;
        this.ctx.strokeText("New Game", this.canvas.width / 2, this.canvas.height / 2 - 60);
        this.ctx.fillText("New Game", this.canvas.width / 2, this.canvas.height / 2 - 60);

        // this.ctx.fillStyle = "yellow";
        // this.ctx.strokeText("New Game", this.canvas.width / 2, this.canvas.height / 2 - 60);
        // this.ctx.fillText("New Game", this.canvas.width / 2, this.canvas.height / 2 - 60);
        // this.ctx.fillStyle = wordsColor;
        // this.ctx.strokeText("Quit", this.canvas.width / 2, this.canvas.height / 2 - 10);
        // this.ctx.fillText("Quit", this.canvas.width / 2, this.canvas.height / 2 - 10);


    }

    quadro(t) {
        this.t0 = this.t0 ?? t;
        this.dt = (t - this.t0) / 1000;
        this.desenhar();
        this.iniciar();
        this.t0 = t;
    }


}