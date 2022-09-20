export default class MoveComponent {
  constructor() {
    this.name = "MOVEMENT";
    this.ax = 0;
    this.vx = 0;
    this.ay = 0;
    this.vy = 0;
  }

  mover(dt) {
    this.vx += this.ax * dt;
    this.x += this.vx * dt;
    this.vy += this.ay * dt;
    this.y += this.vy * dt;
  }

  aceleracao(e) {
    switch (e.key) {
      case "w":
        this.ay = -120;
        break;
      case "s":
        this.ay = +120;
        break;
      case "a":
        this.ax = -120;
        break;
      case "d":
        this.ax = +120;
        break;

      default:
        break;
    }
  }
}
