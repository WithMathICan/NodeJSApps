import {DbRecord, Col} from 'types'

export interface ISpApi {
   GetCols() : Promise<Col[]>
   GetBean(id: string, fields = ['*']): Promise<DbRecord>
   GetBeans(fields = ['*']): Promise<DbRecord[]>
   InsertBean(record: DbRecord): Promise<DbRecord | null>
   UpdateBean(id: string, record: DbRecord): Promise<DbRecord>
   RemoveBeans(ids: string[]): Promise<string[]>
}

// export interface ISpApi{
//    GetColsData(): Promise<Col[]>
//    GetColsEdit(): Promise<Col[]>
//    GetColsCreate(): Promise<Col[]>
//    GetColsCopy(): Promise<Col[]>
//    GetBeans(): Promise<any[]>
//    GetBean(id: string): Promise<any>
//    SaveBean(bean: any): Promise<any>
//    RemoveBeans(ids: string[]) : Promise<string[]>
// }

export type TSpApi = Record<string, Record<string, ISpApi>>
export const api: TSpApi
export type TMsgSeverity = 'warn' | 'success' | 'info' | 'error'

export interface IMessage {
   id: string 
   content: string 
   life: number 
   severity: TMsgSeverity
   closable: boolean 
   timeOut: NodeJS.Timeout
   closeTime: number
}

export function post(url: string, body: any) : Promise<any>