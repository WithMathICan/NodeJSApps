import {PoolClient, Pool, QueryResult} from 'pg'

export type TQuery = (sql: string, arr: any[]) => Promise<QueryResult>

export function createCols(schema: string, table: string, database: string, query: TQuery) : Promise<Col[]>
export function spFindDbTables(schemas: string[], query: TQuery) : Promise<Record<string, string[]>>

