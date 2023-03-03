import { IDbSettings } from "common/src/create-pg"

export interface IConfig {
   DB_SCHEMAS: string[]
   DB_SETTINGS: IDbSettings
   PORT: number
   SP_NAME: string
   RPOJECT_ROOT: string
   PUBLIC_DIR: string
   UPLOADS_SETTINGS_TABLE: string
}

export const config: IConfig
