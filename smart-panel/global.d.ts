import {createCRUD} from 'common'
import { createCols } from './src/lib/sp-functions'
import { FSpModel } from './src/models/sp-model'

type TCreateCrud  = typeof createCRUD
type TCreateCols = typeof createCols

export global {
   namespace sp{
      const createCRUD: TCreateCrud
      const PG_DATABASE: string
      const createCols: TCreateCols
      const models: Record<string, FSpModel>
   }
}