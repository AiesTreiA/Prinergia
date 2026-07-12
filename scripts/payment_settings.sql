-- SQL Schema Update for Red Raíz Sovereign Payments
-- Estructura para registrar los datos de cobro de los facilitadores y sus wallets cripto.

CREATE TABLE IF NOT EXISTS facilitator_payment_settings (
  id BIGSERIAL PRIMARY KEY,
  location_id BIGINT UNIQUE REFERENCES map_locations(id) ON DELETE CASCADE,
  p2p_type VARCHAR(50) DEFAULT 'transferencia', -- 'transferencia', 'mercado_pago', 'crypto'
  
  -- Datos bancarios para transferencias directas P2P
  bank_name VARCHAR(100),
  bank_account_type VARCHAR(50), -- 'corriente', 'vista', 'ahorro'
  bank_account_number VARCHAR(100),
  bank_rut VARCHAR(20),
  bank_email VARCHAR(150),
  
  -- Billetera Criptográfica del facilitador (para cobros directos Web3)
  crypto_wallet_address VARCHAR(100),
  
  -- Credenciales de pasarelas Web2 cifradas (ej: Access Token de Mercado Pago)
  api_key_encrypted TEXT, 
  
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS
ALTER TABLE facilitator_payment_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS:
-- 1. Los administradores (Service Role) tienen acceso total (bypass).
-- 2. Lectura pública deshabilitada para campos sensibles (sólo API puede consultar).
