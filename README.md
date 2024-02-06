# @skorotkiewicz/snowflake-id

> Snowflake ID is a unique identifier commonly used in distributed systems to generate unique IDs with a timestamp component. It is designed to ensure uniqueness, even in distributed and highly concurrent environments.

The Snowflake ID typically consists of three components:

1. **Timestamp:** Representing the time when the ID was generated.
2. **Machine ID:** Identifying the machine or node that generated the ID.
3. **Sequence Number:** Ensuring uniqueness in cases of multiple IDs generated within the same millisecond.

By combining these components, Snowflake IDs provide a reliable way to generate globally unique identifiers, making them valuable for applications such as distributed databases, messaging systems, and more.

## Install

```
yarn add @skorotkiewicz/snowflake-id
or
npm i @skorotkiewicz/snowflake-id
```

## Usage

```js
import { Snowflake, decodeSnowflake } from "@skorotkiewicz/snowflake-id";

(async () => {
  const machineId = 1; // machine ID (0-1023)
  const snowflake = new Snowflake(machineId);

  const id1 = await snowflake.generate();
  console.log("encodeID", id1);
  // output: 7160521316708126720

  const decoded = decodeSnowflake(id1);
  console.log("decodeID", decoded);
  // output: { timestamp: '2024-02-06T05:12:47.730Z', machineId: '1', sequence: '0' }
})();
```
