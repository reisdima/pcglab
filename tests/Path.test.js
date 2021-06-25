import Path from "../js/Path";

describe("Path class", () => {
  describe("is correctly created when", () => {
    it("is an object", () => {
      const path = new Path();
      expect(typeof path).toBe("object");
    });
    
  });
});