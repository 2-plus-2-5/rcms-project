import { IDataAdapter } from './adapter.interface'
import { MockAdapter } from './mock.adapter'
import { SheetsAdapter } from './sheets.adapter'
import { AdapterConfig } from '@/types/sync.types'
import { STORAGE_KEY_CONFIG } from '@/constants/config'

/** Reads persisted adapter config from localStorage */
export function loadAdapterConfig(): AdapterConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG)
    if (raw) return JSON.parse(raw) as AdapterConfig
  } catch {
    // ignore parse errors
  }
  return { type: 'mock' }
}

/** Persists adapter config to localStorage */
export function saveAdapterConfig(config: AdapterConfig): void {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config))
}

/**
 * Factory function — returns the correct adapter for the current config.
 * This is the ONLY place in the codebase that knows which adapter to use.
 */
export function createAdapter(config?: AdapterConfig): IDataAdapter {
  const cfg = config ?? loadAdapterConfig()

  if (cfg.type === 'sheets' && cfg.sheetsUrl) {
    return new SheetsAdapter(cfg)
  }

  // Default to mock (safe fallback)
  return new MockAdapter()
}

/** Singleton adapter instance — re-created when config changes */
let _adapterInstance: IDataAdapter | null = null

export function getAdapter(): IDataAdapter {
  if (!_adapterInstance) {
    _adapterInstance = createAdapter()
  }
  return _adapterInstance
}

/** Call this after saving new config in Settings */
export function resetAdapter(config?: AdapterConfig): void {
  if (config) saveAdapterConfig(config)
  _adapterInstance = createAdapter(config)
}
