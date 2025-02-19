import {type Config} from 'drizzle-kit'

import {env} from '@/env'

export default {
  schema: './src/server/db/schema/user-schema.ts',
  dialect: 'postgresql',
  out: './src/server/db/migrations',
  extensionsFilters: ['postgis'],
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config
