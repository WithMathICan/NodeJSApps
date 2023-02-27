import { QueryResult, Pool } from 'pg'

export interface IDbClient {
   release() : void
   query(sql: string, arr: any[]) : Promise<QueryResult>
   beginTransaction() : Promise<QueryResult>
   commit() : Promise<QueryResult>
   rollback() : Promise<QueryResult>
}

export type FDbClientCreator = () => Promise<IDbClient>
export function initDbClientCreator(pool: Pool) : FDbClientCreator
