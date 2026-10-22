import { randomUUID } from "expo-crypto";

export function generateUuid() {
    const uuid = randomUUID();
    return uuid;
}
