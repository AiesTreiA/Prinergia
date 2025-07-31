"use server"

/**
 * Obtiene el token de acceso de Mapbox de forma segura desde el servidor.
 * Asegúrate de que la variable de entorno MAPBOX_ACCESS_TOKEN (sin NEXT_PUBLIC_)
 * esté configurada en Vercel si es un token sensible.
 */
export async function getMapboxAccessToken(): Promise<string | undefined> {
  // Si el token está configurado como NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  // aún se puede acceder aquí, pero la advertencia de Vercel es sobre su exposición en el cliente.
  // La mejor práctica es que sea solo MAPBOX_ACCESS_TOKEN si es sensible.
  return process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_ACCESS_TOKEN
}
