import crypto from "crypto"

/**
 * Decodifica una cadena codificada en Base32 (formato estándar de secretos TOTP)
 * a un Buffer de bytes.
 */
function decodeBase32(str: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  const cleaned = str.toUpperCase().replace(/[\s-]/g, "")
  const len = cleaned.length
  const numBytes = Math.floor((len * 5) / 8)
  const buf = Buffer.alloc(numBytes)
  
  let val = 0
  let bits = 0
  let index = 0
  
  for (let i = 0; i < len; i++) {
    const idx = alphabet.indexOf(cleaned[i])
    if (idx === -1) continue
    val = (val << 5) | idx
    bits += 5
    if (bits >= 8) {
      bits -= 8
      if (index < numBytes) {
        buf[index++] = (val >>> bits) & 0xff
      }
    }
  }
  return buf
}

/**
 * Verifica si un token TOTP (código de 6 dígitos) es válido para un secreto Base32.
 * @param token Código ingresado (ej: "123456")
 * @param secret Secreto Base32 (ej: "JBSWY3DPEHPK3PXP")
 * @param window Tolerancia de desfase de tiempo (default: 1 paso = +/- 30 segundos)
 */
export function verifyTOTP(token: string, secret: string, window = 1): boolean {
  if (!token || !secret) return false
  
  try {
    const key = decodeBase32(secret)
    const epoch = Math.floor(Date.now() / 1000)
    const currentCounter = Math.floor(epoch / 30)
    
    // Evaluar la ventana de tiempo para compensar desfases de reloj del cliente
    for (let i = -window; i <= window; i++) {
      const counter = currentCounter + i
      
      // Escribir el contador como un entero de 64 bits (Big Endian)
      const buffer = Buffer.alloc(8)
      let temp = counter
      for (let j = 7; j >= 0; j--) {
        buffer[j] = temp & 0xff
        temp = temp >> 8
      }
      
      // Calcular HMAC-SHA1
      const hmac = crypto.createHmac("sha1", key)
      hmac.update(buffer)
      const hash = hmac.digest()
      
      // Truncamiento dinámico
      const offset = hash[hash.length - 1] & 0xf
      const binary =
        ((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff)
      
      // Obtener el código de 6 dígitos
      const code = (binary % 1000000).toString().padStart(6, "0")
      
      if (code === token.trim()) {
        return true
      }
    }
  } catch (err) {
    console.error("Error al verificar TOTP:", err)
  }
  return false
}
