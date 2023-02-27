import {QueryResult} from 'pg'
import { IDbClient } from './dbClient'

export type DbRecord = {
   [x: string]: any
}

export interface ICrud {
   tableName: string
   query(sql: string, arr: any[]): Promise<import('pg').QueryResult>
   queryFirst(sql: string, arr: any[] = []): Promise<DbRecord | null>
   queryAll(sql: string, arr: any[] = []): Promise<DbRecord[]>
   findById(id: string, fields: string[]): Promise<DbRecord | null>
   insert(record: DbRecord): Promise<DbRecord | null>
   update(id: string, record: DbRecord): Promise<DbRecord | null>
   removeMany(ids: string[]): Promise<string[]>
}

export type FQuery = (sql: string, arr: any[]) => Promise<QueryResult<any>>
export function createCRUD(schema: string, table: string, query: FQuery): ICrud
export type FCreateCRUD = typeof createCRUD