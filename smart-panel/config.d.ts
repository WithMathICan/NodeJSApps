import { IDbSettings } from "common/src/create-pg"

export interface IConfig {
   DB_SCHEMAS: string[]
   DB_SETTINGS: IDbSettings
   PORT: number
   SP_NAME: string
   RPOJECT_ROOT: string
   UPLOADS_DIR: string
}

export const config: IConfig
