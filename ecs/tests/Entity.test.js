import Entity from "../Entity";

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
  });
});
