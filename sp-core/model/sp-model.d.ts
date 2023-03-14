import {PoolClient, Pool} from 'pg'
import { Col } from 'classes/Col'
import { FQuery, DbRecord } from 'common/types'


export interface ISpModel {
   cols() : Promise<Record<string, Col>>
   bean(id: string, fields = ['*']): Promise<DbRecord | null>
   beans(fields = ['*']): Promise<DbRecord[]>
   insert(record: DbRecord): Promise<DbRecord>
   update(id: string, record: DbRecord): Promise<DbRecord>
   removeMany(ids: string[]): Promise<string[]>
}

export class Model {
   constructor(query: FQuery)
   cols() : Promise<Record<string, Col>>
   bean(id: string, fields = ['*']): Promise<DbRecord | null>
   beans(fields = ['*']): Promise<DbRecord[]>
   insert(record: DbRecord): Promise<DbRecord>
   update(id: string, record: DbRecord): Promise<DbRecord>
   removeMany(ids: string[]): Promise<string[]>
}

// export type FSpModel = (query: FQuery) => ISpModel;
export type TModel = typeof Model
export function createSpModel(schema: string, table: string, PG_DATABASE: string, fk_title_name: string) : TModel
export type FCreateSpModel = typeof createSpModel
