import {
  ENV_VARS,
  LEGACY_ENV_VARS,
  getEnvironmentConfig,
  getSafeEnvironmentConfig,
  validateEnvironment,
  logEnvironmentStatus,
  type EnvironmentConfig,
} from "./env"

// Server-only environment accessor - re-export all functions
export {
  ENV_VARS,
  LEGACY_ENV_VARS,
  getEnvironmentConfig,
  getSafeEnvironmentConfig,
  validateEnvironment,
  logEnvironmentStatus,
}

export type { EnvironmentConfig }
