class Snowflake {
    constructor(machineId) {
        if (machineId < 0 || machineId >= 1024) {
            throw new Error('Machine ID must be in the range 0-1023.');
        }

        this.machineId = BigInt(machineId);
        this.sequence = BigInt(0);
        this.lastTimestamp = BigInt(-1);

        // Konfiguracja bitów: 41 bitów na czas, 10 bitów na ID maszyny, 12 bitów na sekwencję
        this.timestampShift = 22n;
        this.machineIdShift = 12n;
        this.sequenceMask = 0xFFFn; // 4095 w dziesiętnym, BigInt
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

        const id = ((timestamp & 0x1FFFFFFFFFFn) << this.timestampShift) |
                    (this.machineId << this.machineIdShift) |
                    this.sequence;

        return id.toString(); // Zwraca string, ponieważ BigInt może być zbyt duży dla niektórych zastosowań
    }
}

// Użycie
const machineId = 1; // ID maszyny (0-1023)
const snowflake = new Snowflake(machineId);

const id1 = snowflake.generate();
console.log(id1);
