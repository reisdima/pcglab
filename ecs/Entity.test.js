import Entity from "./Entity";

describe("Entity class", () => {
  describe("Is right when... ", () => {
    it("Can create an instance", () => {
      const entity = new Entity();
      expect(typeof entity).toBe("object");
    });

    it("Has a map of components", () => {
      const entity = new Entity();
      expect(typeof entity.components).toBe("object");
      expect(typeof entity.components.set).toBe("function");
      expect(typeof entity.components.delete).toBe("function");
    });

    it("add a component increase components size", () => {
      const entity = new Entity();
      expect(entity.components.size).toBe(0);
      entity.addComponent({ name: "teste" });
      expect(entity.components.size).toBe(1);
    });

    it("remove a component decrease components size", () => {
      const entity = new Entity();
      const mockComponent = { name: "teste" };
      entity.addComponent(mockComponent);
      expect(entity.components.size).toBe(1);
      entity.removeComponent(mockComponent);
      expect(entity.components.size).toBe(0);
    });
  });
});
