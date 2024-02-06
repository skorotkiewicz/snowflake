class Snowflake {
  constructor(machineId) {
    if (machineId < 0 || machineId >= 1024) {
      throw new Error("Machine ID must be in the range 0-1023.");
    }

    this.machineId = BigInt(machineId);
    this.sequence = BigInt(0);
    this.lastTimestamp = BigInt(-1);

    // Konfiguracja bitów: 41 bitów na czas, 10 bitów na ID maszyny, 12 bitów na sekwencję
    this.timestampShift = 22n;
    this.machineIdShift = 12n;
    this.sequenceMask = 0xfffn; // 4095 w dziesiętnym, BigInt
  }

  generate() {
    let timestamp = BigInt(Date.now());

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & this.sequenceMask;

      if (this.sequence === 0n) {
        while (timestamp <= this.lastTimestamp) {
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

    return id.toString(); // Zwraca string, ponieważ BigInt może być zbyt duży dla niektórych zastosowań
  }
}

function decodeSnowflake(idStr) {
  const id = BigInt(idStr);
  const binary = id.toString(2).padStart(64, "0");

  const timestampShift = 22n;
  const machineIdShift = 12n;
  const sequenceMask = 0xfffn; // 12 bitów na sekwencję

  const timestamp = (id >> (timestampShift + machineIdShift)) & 0x1ffffffffffn;
  const machineId = (id >> machineIdShift) & 0x3ffn; // 10 bitów na ID maszyny
  const sequence = id & sequenceMask;

  // Upewnij się, że epoka jest taka sama, jak użyta do generowania Snowflake IDs
  const epoch = BigInt(1288834974657); // Powinna być taka sama, jak w generatorze
  const date = new Date(Number(epoch + timestamp * 1000n));

  return {
    timestamp: date,
    machineId: machineId.toString(),
    sequence: sequence.toString(),
  };
}

// Użycie
const machineId = 1; // ID maszyny (0-1023)
const snowflake = new Snowflake(machineId);

const id1 = snowflake.generate();
console.log("encodeID", id1);

const idStr = id1; // Przykładowy identyfikator Snowflake
const decoded = decodeSnowflake(idStr);
console.log("decodeID", decoded);
