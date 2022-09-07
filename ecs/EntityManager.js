import Entity from "./Entity.js";

export default class EntityManager {
  constructor() {
    this.entities = [];
  }
  createEntity() {
    const e = new Entity();
    this.entities.push(e);
    return e;
  }
  removeEntity(id) {
    this.entities = this.entities.filter((e) => e.id !== id);
  }
  update(system) {
    system(this);
  }
}
