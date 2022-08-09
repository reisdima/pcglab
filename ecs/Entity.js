export default class Entity {
  constructor(ECS) {
    this.id =
      (+new Date()).toString(16) +
      ((Math.random() * 100000000) | 0).toString(16) +
      ECS.entity_count;

    ECS.entity_count++;

    this.components = {};
  }

  addComponent(component) {
    this.component[component.name] = component;

    return this;
  }

  removeComponent(componentName) {
    var name = componentName;
    if (typeof componentName === "function") {
      name = componentName.name;
    }
    delete this.component[name];
    return this;
  }
  print() {
    console.log(JSON.stringify(this, null, 4));
    return this;
}


};
