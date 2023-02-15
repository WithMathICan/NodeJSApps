import {PoolClient, Pool} from 'pg'

export function createCols(schema: string, table: string, database: string, pg_client: PoolClient | Pool) : Promise<Col[]>
export function spFindDbTables(schemas: string[], pg_client: Pool) : Promise<Record<string, string[]>>

