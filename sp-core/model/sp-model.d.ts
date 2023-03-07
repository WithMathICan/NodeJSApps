import {PoolClient, Pool} from 'pg'
import { Col } from 'classes/Col'
import { FQuery, DbRecord } from 'common/types'


export interface ISpModel {
   cols() : Promise<Col[]>
   bean(id: string, fields = ['*']): Promise<DbRecord | null>
   beans(fields = ['*']): Promise<DbRecord[]>
   insert(record: DbRecord): Promise<DbRecord>
   update(id: string, record: DbRecord): Promise<DbRecord>
   removeMany(ids: string[]): Promise<string[]>
}

export type FSpModel = (query: FQuery) => ISpModel;
export function createSpModel(schema: string, table: string) : FSpModel
export type FCreateSpModel = typeof createSpModel
