import * as Crypto from "expo-crypto";

export function generateUuid() {
    const uuid = Crypto.randomUUID();
    return uuid;
}
