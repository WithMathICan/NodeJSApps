import pg from 'pg'
import { IDb } from './pgwrap'

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

export function createCRUD(schema: string, table: string, pgWrap: IDb): ICrud
export type FCreateCRUD = typeof createCRUD