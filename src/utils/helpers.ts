import * as Crypto from "expo-crypto";

export function generateUuid() {
    return Crypto.randomUUID();
}
