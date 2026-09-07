import { getPayload } from 'payload'
import config from '@payload-config'

/** Payload Local API client (server only). getPayload caches the instance per process. */
export const payloadClient = () => getPayload({ config })
