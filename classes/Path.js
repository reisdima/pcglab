export default class Path{
  constructor(){
      this.steps = [];
  }

  desenhar(ctx,s){
    for(let i = 0; i < this.steps.length; i++){
        ctx.save();
        ctx.fillStyle = "White";
        ctx.linewidth = 1;
        ctx.globalAlpha = 0.0;
        ctx.fillRect(this.steps[i].coluna * s, this.steps[i].linha * s, s, s);
        ctx.restore();
        ctx.fillStyle = "red";
        ctx.strokeStyle = "black";
        this.escreveTexto(ctx, ("."), this.steps[i].coluna * s + s / 2, this.steps[i].linha * s + s / 2);
    }
  }

    escreveTexto(ctx, texto, x, y) {
        ctx.strokeText(texto, x, y);
        ctx.fillText(texto, x, y);
    }

  addStep(bloco){
      this.steps.push(bloco);
  }
}