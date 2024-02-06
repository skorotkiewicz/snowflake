export class Snowflake {
  private machineId: bigint;
  private sequence: bigint;
  private lastTimestamp: bigint;
  private readonly timestampShift: bigint = 22n;
  private readonly machineIdShift: bigint = 12n;
  private readonly sequenceMask: bigint = 0xfffn;

  constructor(machineId: number) {
    if (machineId < 0 || machineId >= 1024) {
      throw new Error("Machine ID must be in the range 0-1023.");
    }

    this.machineId = BigInt(machineId);
    this.sequence = BigInt(0);
    this.lastTimestamp = BigInt(-1);
  }

  async generate(): Promise<string> {
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

interface DecodedSnowflake {
  timestamp: string;
  machineId: string;
  sequence: string;
}

export function decodeSnowflake(idStr: string): DecodedSnowflake {
  const id = BigInt(idStr);
  const timestampShift = 22n;
  const machineIdShift = 12n;
  const sequenceMask = 0xfffn;

  const timestamp = (id >> timestampShift) & 0x1ffffffffffn;
  const machineId = (id >> machineIdShift) & 0x3ffn;
  const sequence = id & sequenceMask;

  const date = new Date(Number(timestamp));

  return {
    timestamp: date.toISOString(),
    machineId: machineId.toString(),
    sequence: sequence.toString(),
  };
}
