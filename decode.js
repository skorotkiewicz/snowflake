function decodeSnowflake(idStr) {
  const id = BigInt(idStr);
  const timestampShift = 22n;
  const machineIdShift = 12n;
  const sequenceMask = 0xfffn;

  const timestamp = (id >> timestampShift) & 0x1ffffffffffn; // Adjusting the shift
  const machineId = (id >> machineIdShift) & 0x3ffn;
  const sequence = id & sequenceMask;

  const date = new Date(Number(timestamp)); // Converting BigInt to Number, then to Date

  return {
    timestamp: date.toISOString(),
    machineId: machineId.toString(),
    sequence: sequence.toString(),
  };
}

// Use
const idStr = "7160488856901390336";
const decoded = decodeSnowflake(idStr);
console.log(decoded);
