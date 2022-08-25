import HealthComponent from "./HealthComponent";

describe("HealthComponent class", () => {
  describe("Is right when... ", () => {
    it("Can create an instance", () => {
      const component = new HealthComponent();
      expect(typeof component).toBe("object");
    });
  });
});
