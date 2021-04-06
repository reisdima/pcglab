var Sprite = require("../classes/Sprite");

describe("Sprite class", () => {
  describe("is correctly created when", () => {
    it("is an object", () => {
      var sprite = new Sprite();
      expect(typeof sprite).toBe("object");
    });
    it("is has an initial position", () => {
      var sprite = new Sprite();
      expect(sprite.x).toBeDefined();
      expect(sprite.y).toBeDefined();
    });
  });
});
