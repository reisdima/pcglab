import BoxComponent from "./components/BoxComponent.js";
import PositionComponent from "./components/PositionComponent.js";
import Entity from "./Entity.js";

export default class Player extends Entity {
  constructor() {
    super();
    this.addComponent(new PositionComponent(30, 50));
    this.addComponent(new BoxComponent(40, 20));
  }
}
