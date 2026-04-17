"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { testSupabaseConnection, checkTablesExist } from "@/lib/supabase"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Table } from "lucide-react"

export function SupabaseStatus() {
  const [status, setStatus] = useState<{
    connected: boolean
    error?: string
    loading: boolean
    envVars: {
      url: boolean
      key: boolean
    }
    tables: {
      [key: string]: boolean
    }
  }>({
    connected: false,
    loading: true,
    envVars: {
      url: false,
      key: false,
    },
    tables: {},
  })

  const checkConnection = async () => {
    setStatus((prev) => ({ ...prev, loading: true }))

    // Verificar variables de entorno
    const envVars = {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }

    try {
      // Verificar conexión básica
      const connectionResult = await testSupabaseConnection()

      // Verificar tablas
      const tablesResult = await checkTablesExist()

      setStatus({
        connected: connectionResult.success,
        error: connectionResult.error || tablesResult.error,
        loading: false,
        envVars,
        tables: tablesResult.tables,
      })
    } catch (error: any) {
      setStatus({
        connected: false,
        error: error.message,
        loading: false,
        envVars,
        tables: {},
      })
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const tableNames = {
    users: "Usuarios",
    professionals: "Profesionales",
    professional_locations: "Ubicaciones",
    professional_specialties: "Especialidades",
    service_modalities: "Modalidades",
  }

  const missingTables = Object.entries(status.tables)
    .filter(([_, exists]) => !exists)
    .map(([table, _]) => table)

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.loading ? (
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
          ) : status.connected && missingTables.length === 0 ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          Estado de Supabase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Conexión y Variables de Entorno */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Database className="h-4 w-4" />
            Conexión
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Estado:</span>
              <Badge variant={status.connected ? "default" : "destructive"}>
                {status.loading ? "Verificando..." : status.connected ? "Conectado" : "Desconectado"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">URL:</span>
              <Badge variant={status.envVars.url ? "default" : "destructive"}>
                {status.envVars.url ? "Configurada" : "Faltante"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Key:</span>
              <Badge variant={status.envVars.key ? "default" : "destructive"}>
                {status.envVars.key ? "Configurada" : "Faltante"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Estado de las Tablas */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Table className="h-4 w-4" />
            Tablas de Base de Datos
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(tableNames).map(([table, displayName]) => (
              <div key={table} className="flex items-center justify-between">
                <span className="text-sm">{displayName}:</span>
                <Badge variant={status.tables[table] ? "default" : "destructive"}>
                  {status.tables[table] ? "Existe" : "Faltante"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Errores */}
        {status.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error:</p>
                <p className="text-sm text-red-700">{status.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Instrucciones para tablas faltantes */}
        {missingTables.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Tablas faltantes:</p>
                <p className="text-sm text-yellow-700 mb-3">
                  Las siguientes tablas no existen: {missingTables.join(", ")}
                </p>
                <div className="text-xs text-yellow-700 space-y-1">
                  <p>
                    <strong>Para solucionarlo:</strong>
                  </p>
                  <p>1. Ve al dashboard de Supabase</p>
                  <p>2. Ejecuta los scripts SQL en el editor SQL</p>
                  <p>
                    3. Ejecuta en orden: 001_create_users_table.sql, 002_create_professionals_table.sql,
                    003_insert_sample_data.sql
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Variables de entorno faltantes */}
        {(!status.envVars.url || !status.envVars.key) && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Variables de entorno faltantes:</strong>
              <br />
              Asegúrate de configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
            </p>
          </div>
        )}

        <Button onClick={checkConnection} disabled={status.loading} className="w-full bg-transparent" variant="outline">
          {status.loading ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Verificar Estado
        </Button>
      </CardContent>
    </Card>
  )
}
