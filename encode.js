class Snowflake {
  constructor(machineId) {
    if (machineId < 0 || machineId >= 1024) {
      throw new Error("Machine ID must be in the range 0-1023.");
    }

    this.machineId = BigInt(machineId);
    this.sequence = BigInt(0);
    this.lastTimestamp = BigInt(-1);

    this.timestampShift = 22n;
    this.machineIdShift = 12n;
    this.sequenceMask = 0xfffn;
  }

  async generate() {
    let timestamp = BigInt(Date.now());

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & this.sequenceMask;

      if (this.sequence === 0n) {
        while (timestamp <= this.lastTimestamp) {
          await new Promise((resolve) => setTimeout(resolve, 1));
          timestamp = BigInt(Date.now());
        }
      }
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    const id =
      ((timestamp & 0x1ffffffffffn) << this.timestampShift) |
      (this.machineId << this.machineIdShift) |
      this.sequence;

    return id.toString();
  }
}

const machineId = 1; // machine ID (0-1023)
const snowflake = new Snowflake(machineId);

const id1 = snowflake.generate();
console.log(id1);
