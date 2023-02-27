export type TAction = 'update' | 'insert' | 'copy'
export interface ICreateSaveDataParams{
   schema: string, 
   table: string, 
   id?: sting, 
   actionType: TAction
}
export function createSaveData(args: ICreateSaveDataParams)
export type FCreateSaveData = typeof createSaveData