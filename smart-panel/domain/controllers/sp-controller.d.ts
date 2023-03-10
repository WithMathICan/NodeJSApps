import {Pool} from 'pg'
import {IDbClient} from 'common/src/pgwrap'
import { ICrud } from '../models/sp-model'
import { FDbClientCreator } from 'common/types'

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
   insert: (record: DbRecord) => Promise<IApiResult<DbRecord | null>>
   update: (record: DbRecord) => Promise<IApiResult<DbRecord | null>>
   removeMany: (args: {ids: string[]}) => Promise<IApiResult<string[]>>
}

export function createSpController(schema: string, table: string) : ITableApi
export type FCreateSpController = typeof createSpController
// export type FTableApi<T> = (args) => Promise<IApiResult<T>>
