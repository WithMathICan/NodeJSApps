import {Pool} from 'pg'
import { FDbClientCreator, FQuery, IDbClient } from 'common/types'
import { FSpModel } from './sp-model'

export interface IApiResult<T>{
   statusCode: number
   message: string
   result: T
}

export interface ITableApi{
   [x: string]: (args: any) => Promise<IApiResult<any>>
   cols: () => Promise<IApiResult<Col[]>>
   bean: (args: {id: string, fields: string[]}) => Promise<IApiResult<DbRecord | null>>
   beans: (args: {fields: string[]}) => Promise<IApiResult<DbRecord[]>>
   insert: (record: DbRecord) => Promise<IApiResult<DbRecord>>
   update: (record: DbRecord) => Promise<IApiResult<DbRecord>>
   removeMany: (args: {ids: string[]}) => Promise<IApiResult<string[]>>
}

export function createSpController(tableName: string, models: Record<string, FSpModel>, createDbClient: FDbClientCreator) : ITableApi
export type FCreateSpController = typeof createSpController
// export type FTableApi<T> = (args) => Promise<IApiResult<T>>
