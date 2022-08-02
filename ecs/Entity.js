ECS.Entity = function Entity() {
  this.id =
    (+new Date()).toString(16) +
    ((Math.random() * 100000000) | 0).toString(16) +
    ECS.Entity._count;

  ECS.Entity._count++;

  this.components = {};

  return this;
};

ECS.Entity._count = 0;

ECS.Entity.addComponet = function addComponent(component) {
  this.component[component.name] = component;

  return this;
};

ECS.Entity.removeComponent = function removeComponent(componentName) {
  var name = componentName;
  if (typeof componentName === "function") {
    name = componentName.name;
  }
  delete this.component[name];
  return this;
};

ECS.Entity.print = function print() {
  console.log(JSON.stringify(this, null, 4));
  return this;
};
