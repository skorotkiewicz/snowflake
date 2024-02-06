import { Snowflake, decodeSnowflake } from "./Snowflake";

describe("Snowflake", () => {
  test("test encode", () => {
    (async () => {
      const machineId = 1; // machine ID (0-1023)
      const snowflake = new Snowflake(machineId);

      const id1 = await snowflake.generate();
      console.log("encodeID", id1);
    })();
  });

  test("test decode", () => {
    (async () => {
      const id1 = "7160500553955414016";

      const decoded = decodeSnowflake(id1);
      console.log("decodeID", decoded);
    })();
  });
});
