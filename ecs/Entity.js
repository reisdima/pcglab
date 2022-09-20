export default class Entity {
  constructor() {
    this.id =
      (+new Date()).toString(16) +
      ((Math.random() * 100000000) | 0).toString(16) +
      Entity.entityCount;

    this.components = new Map();
  }

  get(componentName) {
    return this.components.get(componentName);
  }

  addComponent(component) {
    this.components.set(component.name, component);
    return this;
  }

  removeComponent(component) {
    this.components.delete(component.name);
    return this;
  }

  toString() {
    console.log(JSON.stringify(this, null, 4));
  }
}
