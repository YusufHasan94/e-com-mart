import crypto from "crypto"

/**
 * Generates the Cryptomus HMAC-MD5 request signature.
 *
 * Algorithm:
 *   sign = MD5( base64( JSON.stringify(body) ) + paymentApiKey )
 *
 * @param body           The request payload object (will be JSON-serialised)
 * @param paymentApiKey  Your Cryptomus Payment API key (server-side only)
 */
export function signCryptomus(body: object, paymentApiKey: string): string {
    const encoded = Buffer.from(JSON.stringify(body)).toString("base64")
    return crypto
        .createHash("md5")
        .update(encoded + paymentApiKey)
        .digest("hex")
}
