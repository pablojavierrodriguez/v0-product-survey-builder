// Server-only environment accessor
import {
  getEnvironmentConfig as _getEnvironmentConfig,
  getSafeEnvironmentConfig as _getSafeEnvironmentConfig,
  validateEnvironment as _validateEnvironment,
  logEnvironmentStatus as _logEnvironmentStatus,
  ENV_VARS as _ENV_VARS,
  LEGACY_ENV_VARS as _LEGACY_ENV_VARS,
  type EnvironmentConfig,
} from "./env"

// Re-export with explicit function declarations
export const ENV_VARS = _ENV_VARS
export const LEGACY_ENV_VARS = _LEGACY_ENV_VARS

export function getEnvironmentConfig(): EnvironmentConfig {
  return _getEnvironmentConfig()
}

export function getSafeEnvironmentConfig(): EnvironmentConfig {
  return _getSafeEnvironmentConfig()
}

export function validateEnvironment(): { isValid: boolean; hasWarnings: boolean } {
  return _validateEnvironment()
}

export function logEnvironmentStatus(): void {
  return _logEnvironmentStatus()
}

export type { EnvironmentConfig }
