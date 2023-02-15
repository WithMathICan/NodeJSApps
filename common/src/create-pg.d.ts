import { Pool } from 'pg'

export interface IDbSettings extends PoolConfig {
   database: string,
   user: string,
   password: string,
   host: string,
   port: number
}

export function createPgPool(data: IDbSettings): Pool