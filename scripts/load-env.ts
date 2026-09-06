// Must be imported BEFORE anything that reads process.env (ESM imports are hoisted).
import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env.local', quiet: true })
loadEnv({ quiet: true })
