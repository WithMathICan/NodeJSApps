import { QueryResult } from 'pg'
import { DbRecord } from './crud'

export interface IDb {
   pgRelease() : void
   query(sql: string, arr: any[]) : Promise<QueryResult>
   queryAll(sql: string, arr: any[]) : Promise<DbRecord[]>
   queryFirst(sql: string, arr: any[]) : Promise<DbRecord>
   beginTransaction() : Promise<QueryResult>
   commit() : Promise<QueryResult>
   rollback() : Promise<QueryResult>
}