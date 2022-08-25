export default class Entity {
  constructor(ECS) {
    this.id =
      (+new Date()).toString(16) +
      ((Math.random() * 100000000) | 0).toString(16) +
      Entity.entityCount;


    this.components = new Map();
  }

  addComponent(component) {
    this.component.set(component.name, component);
    return this;
  }

  removeComponent(componentName) {
    this.component.delete(componentName);
    return this;
  }

  print() {
    console.log(JSON.stringify(this, null, 4));
  }
}
