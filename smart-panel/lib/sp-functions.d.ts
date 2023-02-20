import { FQuery } from 'common/main';
import {PoolClient, Pool, QueryResult} from 'pg'

export function createCols(schema: string, table: string, database: string, query: FQuery) : Promise<Col[]>
export function findDbTables(schemas: string[], query: TQuery) : Promise<Record<string, string[]>>

