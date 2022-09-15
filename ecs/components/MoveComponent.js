export default class MoveComponent {
  constructor() {
    this.name = "MOVEMENT";
    this.ax = 0;
    this.vx = 0;
    this.ay = 0;
    this.vy = 0;
  }

  mover(dt) {
    this.vx = this.vx + this.ax * dt;
    this.x = this.x + this.vx * dt;
    this.vy = this.vy + this.ay * dt;
    this.y = this.y + this.vy * dt;
  }

  aceleracao(e, K) {
    switch (e.key) {
      case "w":
        this.ay = -K;
        break;
      case "s":
        this.ay = +K;
        break;
      case "a":
        this.ax = -K;
        break;
      case "d":
        this.ax = +K;
        break;

      default:
        break;
    }
  }
}
