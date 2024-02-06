class Snowflake {
  constructor(machineId, epoch) {
    if (machineId < 0 || machineId >= 1024) {
      throw new Error("Machine ID must be in the range 0-1023.");
    }

    this.epoch = BigInt(epoch); // Ustawienie epoki
    this.machineId = BigInt(machineId);
    this.sequence = BigInt(0);
    this.lastTimestamp = BigInt(-1);

    // Konfiguracja bitów: 41 bitów na czas, 10 bitów na ID maszyny, 12 bitów na sekwencję
    this.timestampShift = 22n;
    this.machineIdShift = 12n;
    this.sequenceMask = 0xfffn; // 4095 w dziesiętnym, BigInt
  }

  async generate() {
    let timestamp = BigInt(Date.now()) - this.epoch; // Odejmowanie epoki

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & this.sequenceMask;

      if (this.sequence === 0n) {
        while (timestamp <= this.lastTimestamp) {
          await new Promise((resolve) => setTimeout(resolve, 1)); // Opóźnienie 1 ms
          timestamp = BigInt(Date.now()) - this.epoch;
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

function decodeSnowflake(idStr, epoch) {
  const id = BigInt(idStr);
  const timestampShift = 22n;
  const machineIdShift = 12n;
  const sequenceMask = 0xfffn; // 12 bitów na sekwencję

  const timestamp = (id >> (timestampShift + machineIdShift)) & 0x1ffffffffffn;
  const machineId = (id >> machineIdShift) & 0x3ffn; // 10 bitów na ID maszyny
  const sequence = id & sequenceMask;

  const epochBigInt = BigInt(epoch); // Upewnij się, że epoka jest BigInt
  const date = new Date(Number(epochBigInt + timestamp * 1000n)); // Dodaj epokę do czasu

  return {
    timestamp: date,
    machineId: machineId.toString(),
    sequence: sequence.toString(),
  };
}

// Użycie
(async () => {
  const machineId = 1; // ID maszyny (0-1023)
  const epoch = 1288834974657; // Ustawienie epoki
  const snowflake = new Snowflake(machineId, epoch);

  const id1 = await snowflake.generate();
  console.log("encodeID", id1);

  const idStr = id1; // Przykładowy identyfikator Snowflake
  const decoded = decodeSnowflake(idStr, epoch);
  console.log("decodeID", decoded);
})();
