import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12 // Recomendado para GCM
const SALT_LENGTH = 16
const KEY_LENGTH = 32
const ITERATIONS = 10000

// Llave maestra de cifrado desde variables de entorno.
// Fallback seguro solo para desarrollo local.
const MASTER_KEY = process.env.PAYMENT_ENCRYPTION_KEY || "fallback-master-key-red-raiz-2026"

/**
 * Deriva una clave criptográfica segura a partir de la llave maestra y un salt.
 */
function deriveKey(salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(MASTER_KEY, salt, ITERATIONS, KEY_LENGTH, "sha256")
}

/**
 * Cifra un texto utilizando AES-256-GCM.
 * Retorna un string formateado como: salt:iv:encryptedText:tag
 */
export function encryptText(text: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH)
  const iv = crypto.randomBytes(IV_LENGTH)
  const key = deriveKey(salt)

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  const tag = cipher.getAuthTag().toString("hex")

  return `${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}:${tag}`
}

/**
 * Descifra un string cifrado previamente con encryptText.
 */
export function decryptText(encryptedPayload: string): string {
  try {
    const parts = encryptedPayload.split(":")
    if (parts.length !== 4) {
      throw new Error("Formato de cifrado inválido.")
    }

    const salt = Buffer.from(parts[0], "hex")
    const iv = Buffer.from(parts[1], "hex")
    const encryptedText = parts[2]
    const tag = Buffer.from(parts[3], "hex")

    const key = deriveKey(salt)
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    let decrypted = decipher.update(encryptedText, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Error al descifrar texto:", error)
    throw new Error("Fallo de seguridad al desencriptar credenciales.")
  }
}
