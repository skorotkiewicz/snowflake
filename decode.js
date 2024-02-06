function decodeSnowflake(idStr) {
    const id = BigInt(idStr);
    const binary = id.toString(2).padStart(64, '0');

    const timestampShift = 22n;
    const machineIdShift = 12n;
    const sequenceMask = 0xFFFn; // 12 bitów na sekwencję

    const timestamp = (id >> (timestampShift + machineIdShift)) & 0x1FFFFFFFFFFn;
    const machineId = (id >> machineIdShift) & 0x3FFn; // 10 bitów na ID maszyny
    const sequence = id & sequenceMask;

    // Upewnij się, że epoka jest taka sama, jak użyta do generowania Snowflake IDs
    const epoch = BigInt(1288834974657); // Powinna być taka sama, jak w generatorze
    const date = new Date(Number(epoch + (timestamp * 1000n)));

    return {
        timestamp: date,
        machineId: machineId.toString(),
        sequence: sequence.toString(),
    };
}

// Użycie
const idStr = '7160488856901390336'; // Przykładowy identyfikator Snowflake
const decoded = decodeSnowflake(idStr);
console.log(decoded);

