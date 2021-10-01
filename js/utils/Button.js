import Sprite from "../../progression/Sprite.js";
import { assets } from "../../ferramentas/numbersGetBigger/Main.js";

export default class Button extends Sprite {
  constructor(x, y, w, h, text, useImage = false) {
    super({});
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.useImage = useImage;
    this.esconder = false;
  }

  desenhar(ctx) {
    if (this.esconder)
      return;
    ctx.beginPath();
    let fontSize = 0.05 * ctx.canvas.height;
    ctx.font = `${fontSize}px 'Skranji'`;
    if (this.useImage) {
      ctx.drawImage(
        assets.img("button"),
        this.x - this.w * 0.65,
        this.y - this.h * 0.9,
        this.w * 1.32,
        this.h * 1.9
      );
    } else {
      ctx.fillStyle = "hsl(42 100% 50% / 1)";
      ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
      ctx.strokeStyle = "hsl(28deg 100% 40%)";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(this.text, this.x, this.y + this.w * 0.04);
  }
}
