import { Pool, QueryResult } from 'pg'

export type DbRecord = {
   [x: string]: any
}

export interface IDbSettings extends PoolConfig {
   database: string,
   user: string,
   password: string,
   host: string,
   port: number
}

export interface IDbClient {
   release() : void
   query(sql: string, arr: any[]) : Promise<QueryResult>
   beginTransaction() : Promise<QueryResult>
   commit() : Promise<QueryResult>
   rollback() : Promise<QueryResult>
}

export interface ICrud {
   tableName: string
   query(sql: string, arr: any[]): Promise<import('pg').QueryResult>
   queryFirst(sql: string, arr: any[] = []): Promise<DbRecord | null>
   queryAll(sql: string, arr: any[] = []): Promise<DbRecord[]>
   findById(id: string, fields: string[]): Promise<DbRecord | null>
   insert(record: DbRecord): Promise<DbRecord>
   update(id: string, record: DbRecord): Promise<DbRecord>
   removeMany(ids: string[]): Promise<string[]>
}

export type FQuery = (sql: string, arr: any[]) => Promise<QueryResult<any>>
export function createCRUD(tableName: string, query: FQuery): ICrud
export type FCreateCRUD = typeof createCRUD

export const createPgPool: (data: IDbSettings) => Pool
export type FDbClientCreator = () => Promise<IDbClient>
export function initDbClientCreator(pool: Pool) : FDbClientCreator