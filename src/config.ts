import { readFileSync } from 'fs'
import { config } from 'dotenv'
import { version } from '../package.json'
import { Env } from '@wavesenterprise/env-extractor'

config()

type BuildInfo = {
  BUILD_ID: string,
  GIT_COMMIT: string,
  DOCKER_TAG: string,
  VERSION: string,
}

function getBuildInfo(): BuildInfo {
  const buildDefault = {
    BUILD_ID: 'development',
    GIT_COMMIT: 'development',
    DOCKER_TAG: 'development',
    VERSION: version,
  }
  try {
    const info = readFileSync('versions.json').toString()
    return {
      ...buildDefault,
      ...JSON.parse(info),
    } as BuildInfo

  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('not found versions.json', (err as Error).message)
  }
  return { ...buildDefault }
}

function parseLogLevel() {
  const defaultLogLevel = new Set(['error', 'warn', 'log', 'debug'])
  const LOG_LEVEL = Env.string('LOG_LEVEL').get()
  if (!LOG_LEVEL) {
    return defaultLogLevel
  }
  try {
    return new Set(LOG_LEVEL.trim()
      .replace(/ +/g, '')
      .split(',')
      .map((s) => s.trim()))
  } catch {
    // eslint-disable-next-line no-console
    console.error('failed to parse logLevel. Set default')
  }
  return defaultLogLevel
}

export const BUILD_INFO = getBuildInfo()

// Node
export const WE_NODE_ADDRESS = Env.string('WE_NODE_ADDRESS').required().get()
export const WE_NODE_API_KEY = Env.string('WE_NODE_API_KEY').default('ADMIN_API_KEY').get()
export const WAVES_NODE_ADDRESS = Env.string('WAVES_NODE_ADDRESS').required().get()
export const WAVES_CHAIN_ID = Env.string('WAVES_CHAIN_ID').required().get()
// Wallets
export const WE_MAIN_WALLET_SEED = Env.string('WE_MAIN_WALLET_SEED').required().get()
export const WAVES_MAIN_WALLET_SEED = Env.string('WAVES_MAIN_WALLET_SEED').required().get()

export const WE_DESTINATION_WALLETS_ADDRESSES = Env.json<string[]>('WE_DESTINATION_WALLETS_ADDRESSES').required().get()
export const WAVES_DESTINATION_WALLETS_ADDRESSES = Env.json<string[]>('WAVES_DESTINATION_WALLETS_ADDRESSES').required().get()

// Settings
export const PORT = Env.number('PORT').default(3040).get()

export const WEST_DAILY_REWARDS_AMOUNT = Env.number('WEST_DAILY_REWARDS_AMOUNT').required().get()
export const WAVES_DAILY_REWARDS_AMOUNT = Env.number('WAVES_DAILY_REWARDS_AMOUNT').required().get()

export const REWARDS_SEND_INTERVAL = Env.number('REWARDS_SEND_INTERVAL').default(60000).get()
export const REWARDS_SENDING_MULTIPLIER = 1 / (86400 * 1000 / REWARDS_SEND_INTERVAL)

export const LOG_LEVEL = parseLogLevel()
export const USE_CLEAN_LOGGER = Env.boolean('USE_CLEAN_LOGGER').default(false).get()
export const SWAGGER_BASE_PATH = Env.string('SWAGGER_BASE_PATH').default('/').get()