export default class Path{
  constructor(){
      this.steps = [];
  }

  desenhar(ctx,s,idTipo){
    switch(idTipo){
      case 0:{
        for(let i = 0; i < this.steps.length; i++){
          ctx.save();
          ctx.fillStyle = "blue";
          ctx.linewidth = 1;
          ctx.globalAlpha = 0.1;
          ctx.fillRect(this.steps[i].coluna * s, this.steps[i].linha * s, s, s);
          ctx.restore();
          ctx.fillStyle = "blue";
          ctx.strokeStyle = "black";
          this.escreveTexto(ctx, (this.steps[i].notacaoTesouros)/*(i)*/, this.steps[i].coluna * s + s / 2, this.steps[i].linha * s + s / 2);
        }
        break;
      }
      default:{
        for(let i = 0; i < this.steps.length; i++){
          ctx.save();
          ctx.fillStyle = "red";
          ctx.linewidth = 1;
          ctx.globalAlpha = 0.1;
          ctx.fillRect(this.steps[i].coluna * s, this.steps[i].linha * s, s, s);
          ctx.restore();
          ctx.fillStyle = "red";
          ctx.strokeStyle = "black";
          this.escreveTexto(ctx, (this.steps[i].direcaoSaida)/*(i)*/, this.steps[i].coluna * s + s / 2, this.steps[i].linha * s + s / 2);
        }
        break;
      }
        
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