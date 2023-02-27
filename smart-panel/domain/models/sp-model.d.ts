import { Col } from 'classes/Col'
import { DbRecord } from './crud'
import {PoolClient, Pool} from 'pg'
import {ICrud} from 'common/src/crud'


export interface ISpModel {
   cols() : Promise<Col[]>
   bean(id: string, fields = ['*']): Promise<DbRecord | null>
   beans(fields = ['*']): Promise<DbRecord[]>
   insert(record: DbRecord): Promise<DbRecord | null>
   update(record: DbRecord): Promise<DbRecord | null>
   removeMany(ids: string[]): Promise<string[]>
}

export type FSpModel = (crud: ICrud) => ISpModel;
export function createSpModel(schema: string, table: string) : FSpModel
export type FCreateSpModel = typeof createSpModel
export {ICrud}
