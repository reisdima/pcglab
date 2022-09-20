import VelocityComponent from "./VelocityComponent";

describe("VelocityComponent class", () => {
  describe("Is right when... ", () => {
    it("Can create an instance", () => {
      const component = new VelocityComponent();
      expect(typeof component).toBe("object");
    });

    it("Has a name", () => {
      const component = new VelocityComponent();
      expect(typeof component.name).toBe("string");
      expect(component.name).toBe("POSITION");
    });

    it("Has a value", () => {
      const component = new VelocityComponent();
      expect(component.vx).toBe(0);
      expect(component.ax).toBe(0);
      expect(component.vy).toBe(0);
      expect(component.ay).toBe(0);
    });
  });
});
