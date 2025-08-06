"use server"

/**
 * Obtiene el token de acceso de Mapbox de forma segura desde el servidor.
 * Asegúrate de que la variable de entorno MAPBOX_ACCESS_TOKEN (sin NEXT_PUBLIC_)
 * esté configurada en Vercel si es un token sensible.
 */
export async function getMapboxAccessToken(): Promise<string | undefined> {
  // Ahora solo leemos la variable de entorno que NO está expuesta al cliente.
  return process.env.MAPBOX_ACCESS_TOKEN
}
