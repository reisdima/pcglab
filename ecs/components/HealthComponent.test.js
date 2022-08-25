import HealthComponent from "./HealthComponent";

describe("HealthComponent class", () => {
  describe("Is right when... ", () => {
    it("Can create an instance", () => {
      const component = new HealthComponent();
      expect(typeof component).toBe("object");
    });

    it("Has a name", () => {
      const component = new HealthComponent();
      expect(typeof component.name).toBe("string");
      expect(component.name).toBe("HEALTH");
    });

    it("Has a value", () => {
      const component = new HealthComponent(100);
      expect(component.value).toBe(100);
      expect(component.maxValue).toBe(100);
    });
  });
});
