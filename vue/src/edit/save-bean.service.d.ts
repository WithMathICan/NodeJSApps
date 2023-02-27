import {Ref} from 'vue'
import type { DbRecord } from '../../../common/types'
import type { Col } from '../../../smart-panel/classes/Col'

export type TAction = 'update' | 'insert' | 'copy'
export interface IEditProps{
   schema: string, 
   table: string, 
   id?: string, 
}
export interface ISaveDataResult {
   bean: Ref<DbRecord>
   cols: Ref<Col[]>
   save: () => Promise<DbRecord>
   init: () => Promise<void>
   isBeanChanged: Ref<boolean>
}
export function createSaveData(props: IEditProps, actionType: TAction): ISaveDataResult
export type FCreateSaveData = typeof createSaveData